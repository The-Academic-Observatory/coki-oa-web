// Copyright 2022 Curtin University
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Author: James Diprose

import { Global } from "@emotion/react";

const Fonts = () => (
  <Global
    styles={`
          /* Brandon Grotesque Bold */
          @font-face {
            font-family:"brandon-grotesque";
            src:url("https://use.typekit.net/af/8f4e31/0000000000000000000132e3/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"),url("https://use.typekit.net/af/8f4e31/0000000000000000000132e3/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"),url("https://use.typekit.net/af/8f4e31/0000000000000000000132e3/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
            font-display:swap;font-style:normal;font-weight:700;
          }

          /* Brandon Grotesque Light */
          @font-face {
            font-family:"brandon-grotesque";
            src:url("https://use.typekit.net/af/1281a1/000000000000000077359ded/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n3&v=3") format("woff2"),url("https://use.typekit.net/af/1281a1/000000000000000077359ded/30/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n3&v=3") format("woff"),url("https://use.typekit.net/af/1281a1/000000000000000077359ded/30/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n3&v=3") format("opentype");
            font-display:swap;font-style:normal;font-weight:300;
          }

          /* Brandon Grotesque Medium */
          @font-face {
            font-family:"brandon-grotesque";
            src:url("https://use.typekit.net/af/d03e48/000000000000000077359df2/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n5&v=3") format("woff2"),url("https://use.typekit.net/af/d03e48/000000000000000077359df2/30/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n5&v=3") format("woff"),url("https://use.typekit.net/af/d03e48/000000000000000077359df2/30/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n5&v=3") format("opentype");
            font-display:swap;font-style:normal;font-weight:500;
          }
          
          /* Brandon Grotesque Black */
          @font-face {
            font-family:"brandon-grotesque";
            src:url("https://use.typekit.net/af/257c86/000000000000000077359df6/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n9&v=3") format("woff2"),url("https://use.typekit.net/af/257c86/000000000000000077359df6/30/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n9&v=3") format("woff"),url("https://use.typekit.net/af/257c86/000000000000000077359df6/30/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n9&v=3") format("opentype");
            font-display:swap;font-style:normal;font-weight:900;
          }
    `}
  />
);

export default Fonts;
