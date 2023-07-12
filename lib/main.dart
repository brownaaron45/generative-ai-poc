import 'dart:typed_data';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
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
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or simply save your changes to "hot reload" in a Flutter IDE).
        // Notice that the counter didn't reset back to zero; the application
        // is not restarted.
        primarySwatch: Colors.blue,
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
      floatingActionButton: const FloatingActionButton(
        onPressed: null,
        tooltip: 'Increment',
        child: Icon(Icons.add),
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

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ElevatedButton(
          onPressed: _openFileExplorer,
          child: const Text('Select PDF'),
        ),
        const SizedBox(height: 16),
        if (_fileBytes != null)
          Expanded(
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
          )
        else
          const Text('No file selected.'),
      ],
    );
  }
}
