(function () {
  const TOTAL_POINTS = parseInt(window.prompt("What is the maximum number of points?"));

  const studentSelect = document.getElementById("gradingcolumn3")
  const studentOptions = studentSelect.options

  const origCreate = window.ActiveCode.prototype.createEditor;

  const studentsAndCode = [];

  const gradeByStudentsIndex = (idx) => {
    if (idx < studentOptions.length) {
      window.ActiveCode.prototype.createEditor = function (index) {
        origCreate.bind(this)(index);
        const origSet = this.editor.setValue;
        const origSetBound = this.editor.setValue.bind(this.editor);
        this.editor.setValue = (value) => {
          origSetBound(value);
          if (this.historyScrubber != null && value == this.history[this.history.length - 1]) {
            this.editor.setValue = origSet;
            const loopCheckOutput = () => {
              const errElem = document.getElementsByClassName("error alert alert-danger")[0];
              const elem = document.getElementsByClassName("unittest-results")[0];
              if (errElem) {
                document.getElementById("input-grade").value = 0;
                document.getElementById("input-comments").value = "autograded; errored";
                document.getElementsByClassName("btn btn-default next")[0].dispatchEvent(new MouseEvent('click'));
              } else if (!elem) {
                setTimeout(() => {
                  loopCheckOutput()
                }, 100);
              } else {
                const score = parseFloat(elem.children[1].innerHTML.split(': ')[1].split('%')[0]) / 100;
                document.getElementById("input-grade").value = score * TOTAL_POINTS;
                document.getElementById("input-comments").value = `autograded; percent correct ${score * 100}%`;
                document.getElementsByClassName("btn btn-default next")[0].dispatchEvent(new MouseEvent('click'));
              }
            }
            loopCheckOutput();
            this.runProg();
          } else {
            setTimeout(() => {
              this.editor.setValue(this.history[this.history.length - 1]);
            }, 100);
          }
        }
      }

      studentSelect.selectedIndex = idx;
      gradeIndividualItem();
    } else {
      window.ActiveCode.prototype = origCreate;
    }
  }
  
  gradeStudentsByIndex(0);
})();
