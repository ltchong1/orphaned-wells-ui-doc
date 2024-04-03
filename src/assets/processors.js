export const processors = [
    // {
    //     id: "e7fedd7b9161dd4b",
    //     name: "Default Google Processor",
    //     displayName: "Default Google Processor",
    //     state: "CO",
    //     img: "./img/CO-well-completion-report.png",
    //     attributes: [
    //         {
    //             name: 'API_Number', 
    //         },
    //         {
    //             name: 'County',
    //         },
    //         {
    //             name: 'Operator', 
    //         },
    //         {
    //             name: 'Spud_Date',
    //         },
    //         {
    //             name: 'State', 
    //         },
    //         {
    //             name: 'Total_Depth',
    //         },
    //     ],
    //     documentType: "Default Google Processor",
    // },
    {
        id: "b61bb82a239330",
        name: "ColoradoDrillingReportExtractor",
        displayName: "Colorado Drilling Report Extractor",
        state: "CO",
        img: "./img/CO-well-completion-report.png",
        // attributes: ['API_NUMBER', 'WELL_NAME', 'WELL_NUMBER', 'NAME_OF_OPERATOR', 'TOTAL_DEPTH_TVD', 'TOTAL_DEPTH_MD'],
        attributes: [
            {
                name: "API_NUMBER",
                data_type: "number",
                occurence: "required_once",
            },
            {
                name: "AS_DRILLED_LATITUDE",
                data_type: "number",
                occurence: "optional_once",
            },
            {
                name: "AS_DRILLED_LONGITUDE",
                data_type: "number",
                occurence: "optional_once",
            },
            {
                name: "CASING_LINER_AND_CEMENT",
                data_type: "list",
                occurence: "optional_once",
                subattributes: [
                    {
                        name: "CASING_LINER_SIZE",
                        data_type: "number",
                        occurence: "optional_multiple",
                    },
                    {
                        name: "CASING_LINER_TOP",
                        data_type: "plain_text",
                        occurence: "optional_multiple",
                    },
                    {
                        name: "CASING_LINER_WT",
                        data_type: "number",
                        occurence: "optional_multiple",
                    },
                    {
                        name: "CASING_TOOL_SETTING_DEPTH",
                        data_type: "number",
                        occurence: "optional_multiple",
                    },
                    {
                        name: "CEMENT_BOTTOM",
                        data_type: "number",
                        occurence: "optional_multiple",
                    },
                    {
                        name: "CEMENT_TOP",
                        data_type: "plain_text",
                        occurence: "optional_multiple",
                    },
                    {
                        name: "HOLE_SIZE",
                        data_type: "number",
                        occurence: "optional_multiple",
                    },
                    {
                        name: "IDENTIFY_METHOD_CALC",
                        data_type: "checkbox",
                        occurence: "optional_multiple",
                    },
                    {
                        name: "IDENTIFY_METHOD_CBL",
                        data_type: "checkbox",
                        occurence: "optional_multiple",
                    },
                    {
                        name: "NUMBER_OF_SACKS_CEMENT",
                        data_type: "number",
                        occurence: "optional_multiple",
                    },
                    {
                        name: "STRING",
                        data_type: "plain_text",
                        occurence: "optional_multiple",
                    },
                ]
            },
            {
                name: "DATE_COMPLETED_OR_DA",
                data_type: "datetime",
                occurence: "required_once",
            },
            {
                name: "DATE_TD_REACHED",
                data_type: "datetime",
                occurence: "required_once",
            },
            {
                name: "ELEVATIONS_GR",
                data_type: "number",
                occurence: "optional_once",
            },
            {
                name: "ELEVATIONS_KB",
                data_type: "number",
                occurence: "optional_once",
            },
            {
                name: "FIELD_NAME",
                data_type: "plain_text",
                occurence: "required_once",
            },
            {
                name: "FIELD_NUMBER",
                data_type: "plain_text",
                occurence: "required_once",
            },
            {
                name: "NAME_OF_OPERATOR",
                data_type: "plain_text",
                occurence: "required_once",
            },
            {
                name: "PLUG_BACK_TOTAL_DEPTH_MD",
                data_type: "number",
                occurence: "optional_once",
            },
            {
                name: "PLUG_BACK_TOTAL_DEPTH_TVD",
                data_type: "number",
                occurence: "optional_once",
            },
            {
                name: "SPUD_DATE",
                data_type: "datetime",
                occurence: "required_once",
            },
            {
                name: "TOTAL_DEPTH_MD",
                data_type: "number",
                occurence: "optional_once",
            },
            {
                name: "TOTAL_DEPTH_TVD",
                data_type: "number",
                occurence: "optional_once",
            },
        
            {
                name: "WELL_CLASSIFICATION_COALBED",
                data_type: "checkbox",
                occurence: "optional_once",
            },
            // {
            //     name: "WELL_CLASSIFICATION_DRY",
            //     data_type: "checkbox",
            //     occurence: "optional_once",
            // },
            {
                name: "WELL_CLASSIFICATION_GAS",
                data_type: "checkbox",
                occurence: "optional_once",
            },
            {
                name: "WELL_CLASSIFICATION_OIL",
                data_type: "checkbox",
                occurence: "optional_once",
            },
            {
                name: "WELL_NAME",
                data_type: "plain_text",
                occurence: "required_once",
            },
            {
                name: "WELL_NUMBER",
                data_type: "plain_text",
                occurence: "required_once",
            },
        ],
        documentType: "Well Completion Report",
    },
]

			
