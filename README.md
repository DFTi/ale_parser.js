# ale_parser.js

Avid Log Exchange (ALE) Parser written in pure JavaScript for use in the browser or from Node.js

## Examples

### In Node.js

Here's a JavaScript example of reading a file and outputting the JSON
data retrieved from the parser

```javascript
var ale;
fs.readFile("logexchange.ale", function (err, data) {
  if (err) throw err;
  ale = new AleParser(data);
  console.log(ale.heading);
  // ale.column is available but is useless considering
  // that ale.data will map to these columns for us
  console.log(ale.data);
});
```

### In the Browser

Here's a CoffeeScript example of using `<input>`, File, and FileReader
to send an ALE into the parser on an HTML5 web page to POST ALE as JSON

```coffeescript
class AleInputHandler
  constructor: () ->
    @input = $('input#ale-input')
    @input.on 'change', @handle_ale

  handle_ale: (evt) =>
    reader = new FileReader()
    reader.onloadend = (e) =>
      if e.target.readyState == FileReader.DONE
        ale = new AleParser(e.target.result)
        $.post "/ingest_ale",
          heading: ale.heading,
          column: ale.column,
          data: ale.data
        @input.val('')
    reader.readAsText(evt.target.files[0])
```
