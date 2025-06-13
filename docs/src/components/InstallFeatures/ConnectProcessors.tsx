export function ConnectProcessorsOverview() {
    return (
        <div>
            OGRRE relies on Google Document AI extractors for document processing. <i>These must be trained before incorporating into OGRRE</i>. To learn more about Document AI, check out their <a target='_blank' href='https://cloud.google.com/document-ai#documentation'>documentation</a>. To connect your processor to OGRRE, follow this guide.
        </div>
    );
}

export function ProcessorList() {
    return (
        <div>
            OGRRE relies on some JSON files to know which processors to look for and which versions of those processors to use. First, you must create JSON file containing a list of your processors, called <code>Extractor Processors.json</code>. Each processor should contain the following keys:
            <ol>
                <li><b>Processor Name</b>: The name of the processor</li>
                <li><b>Processor ID</b>: The processor ID on Google,</li>
                <li><b>Model ID</b>: The ID of the processor version you wish to use. Processors can have multiple trained versions. If not provided, OGRRE will use the default model.</li>
            </ol>
            <p>For an example of this file, see <a>here TODO add link</a>.</p>
        </div>
    );
}

export function CreateSchemas() {
    return (
        <div>
            For each processor you want to incorporate, you must create a schema. Google does not provide an API for fetching processor schemas, so a schema is necessary to ensure all fields show up on each document, whether found by the processor or not. Schemas should be a JSON file containing a list of the fields that you want to extract. Each field should contain the following:
            <ol>
                <li><b>page_order_sort</b>: Order you want the field to show up in OGRRE</li>
                <li><b>name</b>: The key of the field</li> 
                <li><b>google_data_type</b>: The google data type (one of TODO: what are the google data type options?)</li> 
                <li><b>occurrence</b>: Field occurrence (one of TODO: what are the possible occurrences?)</li> 
                <li><b>grouping</b>: Group that this field is associated with, if any (in document AI this would be for table fields/subfields)</li>
                <li><b>database_data_type</b>: The data type you want in your database (one of TODO: what are the database data type options?)</li> 
                <li><b>cleaning_function</b>: The cleaning function you want applied to your field <i>(optional)</i> (one of TODO: what are the cleaning functions?)</li>
                <li><b>model_enabled</b>: Boolean indicating whether the field is enabled <i>(optional)</i></li>
            </ol>
            <p>For an example of a processor schema, see <a>here TODO add link</a>.</p>
        </div>
    );
}

export function AddFilesToRepo() {
    return (
        <div>
            Once you have created the processor data files, you must add them to the proper location.
        </div>
    );
}
