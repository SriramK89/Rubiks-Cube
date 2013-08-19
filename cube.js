var cube_faces = ["Red", "Blue", "Green", "White", "Orange", "Yellow"];
var rubiks_cube = null;
function create_3d_array(rows, cols, depth) {
  var array = new Array(rows);
  for(var i = 0 ; i < rows ; i++) {
    array[i] = new Array(cols);
  }
  for(var i = 0 ; i < rows ; i++) {
    for(var j = 0 ; j < cols ; j++) {
      array[i][j] = new Array(depth);
    }
  }
  return array
}
function load_cube() {
  var faces = 6;
  rubiks_cube = create_3d_array(6, 3, 3);
  while(faces > 0) {
    var row_cells = 3;
    console.log("face: " + (7 - faces));
    while(row_cells > 0) {
      var col_cells = 3
      while(col_cells > 0) {
        cell_colour = Math.floor((Math.random()*6)+1);
        rubiks_cube[6 - faces][3 - row_cells][3 - col_cells] = cube_faces[cell_colour - 1]
        console.log(cube_faces[cell_colour - 1])
        if(faces == 6) {
          console.log($("#row" + (4 - row_cells) + "_col" + (4 - col_cells)).attr("src", "faces/" + cube_faces[cell_colour - 1] + ".png"));
        }
        col_cells--;
      }
      row_cells--;
    }
    faces--;
  }
}
function initialize_cube() {
  load_cube();
  $("#restart_game").click(function() {
    if(confirm("Your progress will be lost. Are you sure to restart the game?")) {
      load_cube();
    }
  });
}
$(document).ready(function() {
  initialize_cube();
});