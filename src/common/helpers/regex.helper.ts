import { Injectable } from "@nestjs/common";


@Injectable()
export class RegexHelper {
  constructor() {
  }

  escapeRegex(text: string): string {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

}

















