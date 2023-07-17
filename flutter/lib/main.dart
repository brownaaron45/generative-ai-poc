import 'dart:convert';
import 'dart:math';
import 'dart:typed_data';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:pdf_render/pdf_render_widgets.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Generative AI POC',
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        colorSchemeSeed: Colors.blue,
      ),
      home: const MyHomePage(title: 'Generative AI POC'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: const Center(
        child: PdfUploadWidget(),
      ),
    );
  }
}

class PdfUploadWidget extends StatefulWidget {
  const PdfUploadWidget({super.key});

  @override
  PdfUploadWidgetState createState() => PdfUploadWidgetState();
}

class PdfUploadWidgetState extends State<PdfUploadWidget> {
  Uint8List? _fileBytes;
  String? _summaryText;

  double margin = 0;
  double padding = 16;

  Future<void> _openFileExplorer() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
    );

    if (result != null) {
      setState(() {
        _fileBytes = result.files.single.bytes;
      });
    }
  }

  Future<void> _summarizePdf() async {
    try {
      var url = Uri.parse('http://localhost:3000/summarize');
      var request = http.MultipartRequest('POST', url);
      var multipartFile = http.MultipartFile.fromBytes(
        'pdf',
        _fileBytes!,
        contentType: MediaType('application', 'pdf'),
        filename: 'example.pdf',
      );
      request.files.add(multipartFile);

      var response = await request.send();
      if (response.statusCode == 200) {
        final bodyStream = response.stream.transform(utf8.decoder);
        final bodyString = await bodyStream.join();

        setState(() {
          _summaryText = bodyString;
        });
      } else {
        print('Failed to upload');
      }
    } catch (e) {
      print(e);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 16),
        ElevatedButton(
          onPressed: _openFileExplorer,
          child: const Text('Select PDF'),
        ),
        const SizedBox(height: 16),
        if (_fileBytes != null)
          Expanded(
            child: Row(
              children: [
                SizedBox(
                  width: max(MediaQuery.of(context).size.width / 2, 500),
                  child: PdfDocumentLoader.openData(
                    _fileBytes!,
                    documentBuilder: (context, pdfDocument, pageCount) =>
                        LayoutBuilder(
                      builder: (context, constraints) => ListView.builder(
                        itemCount: pageCount,
                        itemBuilder: (context, index) => Container(
                          margin: EdgeInsets.all(margin),
                          padding: EdgeInsets.all(padding),
                          color: Colors.black12,
                          child: PdfPageView(
                            pdfDocument: pdfDocument,
                            pageNumber: index + 1,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (_summaryText == null)
                        ElevatedButton(
                          onPressed: _fileBytes == null
                              ? null
                              : () async {
                                  await _summarizePdf();
                                },
                          child: const Text("Summarize PDF"),
                        )
                      else
                        Expanded(
                          child: Column(
                            children: [
                              ElevatedButton(
                                onPressed: _fileBytes == null
                                    ? null
                                    : () async {
                                        await _summarizePdf();
                                      },
                                child: const Text("Summarize PDF"),
                              ),
                              Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Text(
                                  _summaryText!,
                                  style: Theme.of(context).textTheme.bodyLarge,
                                ),
                              ),
                            ],
                          ),
                        )
                    ],
                  ),
                ),
              ],
            ),
          )
        else
          const Text('No file selected.'),
      ],
    );
  }
}
