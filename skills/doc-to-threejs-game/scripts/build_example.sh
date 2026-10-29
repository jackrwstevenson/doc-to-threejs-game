#!/bin/bash
# Template: concatenate your JS parts into one module inside the HTML shell.
# Edit the file lists. Output: ../<slug>.html and /tmp/all.js (for the headless tests).
cd "$(dirname "$0")"
PARTS="b_data.js c_core.js d_helpers.js e_zone1.js f_path.js g_zone3.js h_nature.js i_player.js j_ui.js k_loop.js"
{ cat a_head.html; echo '<script type="module">'; cat $PARTS; echo '</script></body></html>'; } > out.html
cat $PARTS > /tmp/all.js
