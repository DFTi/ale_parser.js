var expect = require('chai').expect,
    fs = require('fs'),
    AleParser = require(__dirname+'/../src/ale_parser.js'),
    fixture = __dirname+"/fixture.ale", // Thank you.
    text;



describe("Ale Parser", function() {
  before(function(done) {
    fs.readFile(fixture, function (err, data) {
      if (err) throw err;
      text = data;
      done();
    });
  });

  beforeEach(function() {
    ale = new AleParser(text);
  });

  describe("#heading", function() {
    it("returns the header of the ALE as JSON", function() {
      expect(ale.heading).to.deep.equal({
        'FIELD_DELIM':'TABS',
        'VIDEO_FORMAT':'1080',
        'FILM_FORMAT':'35mm, 4 perf',
        'AUDIO_FORMAT':'48khz',
        'FPS':'23.976'
      });
    })
  });

  describe("#column", function() {
    it("returns the columns of the ALE as an array", function () {
      expect(ale.column).to.deep.equal([
        'Name', 'FPS', 'End', 'Take', 'Reel #', 'Auxiliary TC1', 'Scene',
        'Camroll', 'Camera', 'Shoot Date', 'Soundroll', 'Audio Bit Depth',
        'ASC_SOP', 'ASC_SAT', 'Duration', 'Audio SR', 'Source File',
        'Tracks', 'Start', 'Tape', 'Unc', 'Manufacturer', 'Descript',
        'Comments', 'Trk1', 'Trk2', 'Trk3', 'Trk4', 'Circled take',
        'Roll/card', 'Shoot day', 'Resolve_sizing'
      ])
    })
  });

  describe("#data", function() {
    it("returns clip metadata in the ALE as an array of objects", function() {
      expect(ale.data[25]['Audio Bit Depth']).to.equal("16");
      expect(ale.data[14]['FPS']).to.equal("23.98");
      expect(ale.data[7]['Camroll']).to.equal("A120");
      expect(ale.data[24]['Name']).to.equal("101D-3b");
      expect(ale.data[16]['Tape']).to.equal("B096C004_111215_R1XE");
      expect(ale.data[27]['Resolve_sizing']).to.equal("(0.0000 0.0000 1.0000 0.0000 0.0000 0 0)");
      expect(ale.data[27]['Name']).to.equal("101D-6b");
      expect(ale.data[0]['Resolve_sizing']).to.equal("(0.0000 0.0000 1.0000 0.0000 0.0000 0 0)");
      expect(ale.data[5]['Name']).to.equal("101B-6a");
    });
  });

  // TODO: Throw error if heading field delim is not TABS
  //       or read DELIM in heading and use that as the delimiter.
  //       unfortunately I don't know what that value might be besides TABS

});
