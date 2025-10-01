  Why you should do it regularly: https://github.com/browserslist/update-db#readme
A PostCSS plugin did not pass the `from` option to `postcss.parse`. This may cause imported assets to be incorrectly transformed. If you've recently added a PostCSS plugin that raised this warning, please contact the package author to fix the issue.
✓ 1641 modules transformed.
x Build failed in 2.38s
error during build:
[vite:esbuild] Transform failed with 3 errors:
/opt/render/project/src/client/src/components/TextInputModal.tsx:72:14: ERROR: Unexpected closing "textarea" tag does not match opening "form" tag
/opt/render/project/src/client/src/components/TextInputModal.tsx:91:10: ERROR: Unexpected closing "form" tag does not match opening "div" tag
/opt/render/project/src/client/src/components/TextInputModal.tsx:93:10: ERROR: Unterminated regular expression
file: /opt/render/project/src/client/src/components/TextInputModal.tsx:72:14
Unexpected closing "textarea" tag does not match opening "form" tag
70 |              rows={4}
71 |              data-testid="input-text"
72 |            /></textarea>
   |                ^
73 |            <div className="flex justify-end gap-2 mt-3">
74 |              <button
Unexpected closing "form" tag does not match opening "div" tag
89 |              </button>
90 |            </div>
91 |          </form>
   |            ^
92 |        </div>
93 |      </div>
Unterminated regular expression
91 |          </form>
92 |        </div>
93 |      </div>
   |            ^
94 |    );
95 |  }
    at failureErrorWithLog (/opt/render/project/src/node_modules/vite/node_modules/esbuild/lib/main.js:1472:15)
    at /opt/render/project/src/node_modules/vite/node_modules/esbuild/lib/main.js:755:50
    at responseCallbacks.<computed> (/opt/render/project/src/node_modules/vite/node_modules/esbuild/lib/main.js:622:9)
    at handleIncomingPacket (/opt/render/project/src/node_modules/vite/node_modules/esbuild/lib/main.js:677:12)
    at Socket.readFromStdout (/opt/render/project/src/node_modules/vite/node_modules/esbuild/lib/main.js:600:7)
    at Socket.emit (node:events:518:28)
    at addChunk (node:internal/streams/readable:561:12)
    at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
    at Readable.push (node:internal/streams/readable:392:5)