/* Takes a string `buffer` and evaluates the heading, column, and data
 * exposing these as JSON for consumption by your application */
function AleParser(buffer) {
  this.raw = buffer.toString();
  this.heading = {};
  this.column = [];
  this.data = [];
  var d = "\t";

  /* The following documentation for parseRows and subsequent
   * implementation of CSV parsing are from the csv2json and d3 projects.
   * -----------------------------------------------------------------------
   * Parses the specified string, which is the contents of a CSV file,
   * returning an array of arrays representing the parsed rows. The string 
   * is assumed to be RFC4180-compliant. Unlike the parse method, this
   * method treats the header line as a standard row, and should be used
   * whenever the CSV file does not contain a header. Each row is represented
   * as an array rather than an object. Rows may have variable length.
   * For example, consider the following CSV file:

   * 1997,Ford,E350,2.34
   * 2000,Mercury,Cougar,2.38
   * The resulting JavaScript array is:

   * [
   * ["1997", "Ford", "E350", "2.34"],
   * ["2000", "Mercury", "Cougar", "2.38"]
   * ]
   * Note that the values themselves are always strings; they will not be automatically converted to numbers. See parse for details.

   * An optional accessor function may be specified as the second argument.
   * This function is invoked for each row in the CSV file, being passed the
   * current row and index as two arguments. The return value of the function
   * replaces the element in the returned array of rows; if the function
   * returns null, the row is stripped from the returned array of rows.
   * In effect, the accessor is similar to applying a map and filter operator
   * to the returned rows. The accessor function is used by parse to convert
   * each row to an object with named attributes.
   */
  this.parseRows = function(delim, text, f) {
    var delimiterCode = delim.charCodeAt(0);
    var EOL = {}, // sentinel value for end-of-line
    EOF = {}, // sentinel value for end-of-file
    rows = [], // output rows
    N = text.length,
    I = 0, // current character index
    n = 0, // the current line number
    t, // the current token
    eol; // is the current token followed by EOL?

    function token() {
      if (I >= N) return EOF; // special case: end of file
      if (eol) return eol = false, EOL; // special case: end of line

      // special case: quotes
      var j = I;
      if (text.charCodeAt(j) === 34) {
        var i = j;
        while (i++ < N) {
          if (text.charCodeAt(i) === 34) {
            if (text.charCodeAt(i + 1) !== 34) break;
            ++i;
          }
        }
        I = i + 2;
        var c = text.charCodeAt(i + 1);
        if (c === 13) {
          eol = true;
          if (text.charCodeAt(i + 2) === 10) ++I;
        } else if (c === 10) {
          eol = true;
        }
        return text.substring(j + 1, i).replace(/""/g, "\"");
      }

      // common case: find next delimiter or newline
      while (I < N) {
        var c = text.charCodeAt(I++), k = 1;
        if (c === 10) eol = true; // \n
        else if (c === 13) { eol = true; if (text.charCodeAt(I) === 10) ++I, ++k; } // \r|\r\n
        else if (c !== delimiterCode) continue;
        return text.substring(j, I - k);
      }

      // special case: last token before EOF
      return text.substring(j);
    }

    while ((t = token()) !== EOF) {
      var a = [];
      while (t !== EOL && t !== EOF) {
        a.push(t);
        t = token();
      }
      if (typeof(f)==='function' && !(a = f(a, n++))) continue;
      rows.push(a);
    }

    return rows;
  }

  var currentSection;
  var lines = this.raw.split('\n');
  for (var i = 0, l = lines.length; i < l; i ++) {
    var line = lines[i];
    if (line == "Heading")
      currentSection = line;
    else if (line == "Column")
      currentSection = line;
    else if (line == "Data")
      currentSection = line;
    else {
      if (currentSection == "Heading") {
        var headRow = this.parseRows(d, line);
        if(headRow.length > 0)
          this.heading[headRow[0][0].toString()] = headRow[0][1];
      }
      else if (currentSection == "Column") {
        var colRow = this.parseRows(d, line);
        if(colRow.length > 0)
          this.column = colRow[0];
      }
      else if (currentSection == "Data") {
        var dataRow = this.parseRows(d, line);
        if(dataRow.length > 0) 
          {
            var clipMeta = {};
            for(var k = 0; k < dataRow[0].length; k++) {
              clipMeta[this.column[k]] = dataRow[0][k];
            }
            this.data.push(clipMeta);
          }
      }
    }
  }
}


// Supported in Node.js
if (typeof(module) !== "undefined")
  module.exports = AleParser;

