import { EventEmitter } from "events";

declare module "pdf2json-types" {
   class Pdfparser extends EventEmitter {
    constructor();
    parseBuffer(buffer: Buffer): void;
    loadPDF(pdfFilePath: string, verbosity?: number):Promise<void>
    createParserStream():ParserStream
    on<K extends keyof EventMap>(eventName: K, listener: EventMap[K]): this
  }

  type EventMap = {
      "pdfParser_dataError": (errMsg: string) => void;
      "pdfParser_dataReady": (pdfData: Output) => void;
      "readable": (meta: Output["Meta"]) => void;
      "data": (data: Output["Pages"][number]|null) => void;
  }

   class ParserStream {
    // TODO
  }


  export interface Output{
      Transcoder: string,
      Meta: Record<string, any>
      Pages: Page[]
  }

   interface Page{
      Width: number,
      Height: number,
      HLines: Line[],
      VLines: Line[],
      Fills: Fill[],
      Texts: Text[],
      Fields: Field[],
      Boxsets: Boxset[]
  }

   interface Fill {
      x: number,
      y: number,
      w: number,
      h: number,
      oc?: string,
      clr?: number
  }

   interface Line {
      x: number,
      y: number,
      w: number,
      oc?: string,
      clr?:number
  }

   interface Text {
      x: number,
      y: number,
      w: number,
      sw: number,
      A: "left" | "center" | "right",
      R: TextRun[]
      oc?:string;
      clr?: number;
  }

   interface TextRun {
      T: string,
      S: number,
      TS: [number, number, 0|1, 0|1]
      RA?: number
  }

   interface Boxset {
      boxes: Box[],
      id : {
          Id: string,
          EN?: number
      }
  }

   interface Field {
      id: {
          Id: string,
          EN?: number
      },
      style: number,
      TI: number,
      AM: number,
      TU: string,
      x: number,
      y: number,
      w: number,
      h: number,
      T: {
          Name: "alpha" | "link",
          TypeInfo: {}
      }
  }

   interface Box {
      x: number,
      y: number,
      w: number,
      h: number,
      oc?: string,
      clr?: number
  }

   interface Box {
      id : {
          Id : string,
          EN? : number
      }
      T: {
          Name : string,
          TypeInfo? : {}
      }
      x: number,
      y: number,
      w: number,
      h: number,
      TI: number;
      AM: number;
      checked?: boolean;
      style: number
  }

}
