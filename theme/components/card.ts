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
// Author: Alex Massen-Hane

const Card = {
    variants: {
			dashboard: {
        
				container: {
					size: "s",
					direction: "column",
					width: "95%",
					height: "100%",
					p: "5px", 
					
					borderColor: "gray.100",
      		        borderWidth: "1px",
					borderRadius: "0",
    			    // borderStyle: "solid",
    			    // boxSizing: "border-box",

					// _even: {
					// 	background: "#F9FAFA"
					// 	},
					// _odd: {
					// 	background: "white",
					// },
				},

				header: {
					p: "5px",
					pt: "20px",
					pl: "22px",
					pr: "20px",
					height: "5%",
					fontWeight: 500,
        	fontSize: "15px",
					textStyle: "tableCell",
					textTransform: "uppercase",
					fontVariantNumeric: "tabular-nums",
					

				},
				body: {
					textStyle: "tableCell",
					textTransform: "uppercase",
					fontWeight: 500,
        	fontSize: "13px",

				}
			},
	  },
  };
  
  
export default Card;