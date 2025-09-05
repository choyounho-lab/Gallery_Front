// 타입 선언용 파일 , 다른 파일이랑 겹치지 않도록 타입 선언시에만 사용 권장.
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    bg: string;
    color: string;
    fontSize?: string;
  }
}
