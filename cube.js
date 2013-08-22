var rubiks_cube = null;
var current_face = 0;
var cube_rotation = [0, 1, 2, 3, 4, 5] // Format: [Front face, Right face, Back face, Left face, Up face, Down face]
var finished = null;

// Function to create 2D array for Rubik's cube and also to find transpose
function create_2d_array(rows, cols) {
  var array = new Array(rows);
  for(var i = 0 ; i < rows ; i++) {
    array[i] = new Array(cols);
  }
  return array;
}

// Function to create 3D array for Rubik's cube
function create_3d_array(rows, cols, depth) {
  var array = create_2d_array(rows, cols);
  for(var i = 0 ; i < rows ; i++) {
    for(var j = 0 ; j < cols ; j++) {
      array[i][j] = new Array(depth);
    }
  }
  return array;
}

// Function to rotate matrix clockwise
// Will be used when the left/right/top/bottom row is rotated.
function rotate_clockwise(input_array) {
  var output_array = create_2d_array(3, 3);
  for(var i = 0 ; i < 3 ; i++) {
    for(var j = 0 ; j < 3 ; j++) {
      output_array[j][2 - i] = input_array[i][j];
    }
  }
  return output_array;
}

// Function to rotate matrix anti-clockwise
// Will be used when the left/right/top/bottom row is rotated.
function rotate_anti_clockwise(input_array) {
  var output_array = create_2d_array(3, 3);
  for(var i = 0 ; i < 3 ; i++) {
    for(var j = 0 ; j < 3 ; j++) {
      output_array[2 - j][i] = input_array[i][j];
    }
  }
  return output_array;
}

// Function to check if the Rubik's cube has been solved or not
function check_game_finished() {
  if(!finished) {
    var solved = new Array(6);
    for(var i = 0 ; i < 6 ; i++) {
      solved[i] = false;
    }
    for(var i = 0 ; i < 6 ; i++) {
      var colours = new Array(9);
      var l = 0;
      for(var j = 0 ; j < 3 ; j++) {
        for(var k = 0 ; k < 3 ; k++) {
          colours[l++] = rubiks_cube[i][j][k];
        }
      }
      for(var j = 0 ; j < 8 ; j++) {
        if(j == 0) {
          solved[i] = (colours[j] == colours[j + 1]);
        } else {
          solved[i] = solved[i] && (colours[j] == colours[j + 1]);
        }
      }
    }
    for(var i = 0 ; i < 5 ; i++) {
      if(i == 0) {
        finished = (solved[i] && solved[i + 1]);
      } else {
        finished = finished && (solved[i] && solved[i + 1]);
      }
    }
  }
  if(finished) {
    if(confirm("You have completed solving the Rubik's Game. Do you wish to play another one?")) {
      load_cube();
    }
  }
}

// Function to display the cube
function display_cube() {
  for(var i = 0 ; i < 3 ; i++) {
    for(var j = 0 ; j < 3 ; j++) {
      $("#row" + (i + 1) + "_col" + (j + 1)).attr("src", "faces/" + rubiks_cube[current_face][i][j] + ".png");
    }
  }
  // check_game_finished();
}

// Function to initialize/reset the Rubik's cube
function load_cube() {
  var cube_faces = ["Red", "Blue", "Green", "White", "Orange", "Yellow"];
  var faces = 6;
  rubiks_cube = create_3d_array(6, 3, 3);
  while(faces > 0) {
    var row_cells = 3;
    while(row_cells > 0) {
      var col_cells = 3
      while(col_cells > 0) {
        cell_colour = Math.floor((Math.random()*6)+1);
        rubiks_cube[6 - faces][3 - row_cells][3 - col_cells] = cube_faces[cell_colour - 1]
        col_cells--;
      }
      row_cells--;
    }
    faces--;
  }
  finished = false;
  display_cube();
}

// Function to handle cube rotation towards leftside
function handle_turn_cube_left() {
  for(var i = 0 ; i < 3 ; i++) {
    cube_rotation[i] = cube_rotation[i + 1];
  }
  cube_rotation[i] = current_face;
  current_face = cube_rotation[0];
  rubiks_cube[cube_rotation[4]] = rotate_clockwise(rubiks_cube[cube_rotation[4]]);
  rubiks_cube[cube_rotation[5]] = rotate_anti_clockwise(rubiks_cube[cube_rotation[5]]);
  display_cube();
}

// Function to handle cube rotation towards upwards
function handle_turn_cube_up() {
  cube_rotation[0] = cube_rotation[5];
  cube_rotation[5] = cube_rotation[2];
  cube_rotation[2] = cube_rotation[4];
  cube_rotation[4] = current_face;
  current_face = cube_rotation[0];
  rubiks_cube[cube_rotation[1]] = rotate_clockwise(rubiks_cube[cube_rotation[1]]);
  rubiks_cube[cube_rotation[3]] = rotate_anti_clockwise(rubiks_cube[cube_rotation[3]]);
  display_cube();
}

// Function to handle cube rotation towards downwards
function handle_turn_cube_down() {
  cube_rotation[0] = cube_rotation[4];
  cube_rotation[4] = cube_rotation[2];
  cube_rotation[2] = cube_rotation[5];
  cube_rotation[5] = current_face;
  current_face = cube_rotation[0];
  rubiks_cube[cube_rotation[1]] = rotate_anti_clockwise(rubiks_cube[cube_rotation[1]]);
  rubiks_cube[cube_rotation[3]] = rotate_clockwise(rubiks_cube[cube_rotation[3]]);
  display_cube();
}

// Function to handle cube rotation towards rightside
function handle_turn_cube_right() {
  current_face = cube_rotation[3];
  for(var i = 3 ; i > 0 ; i--) {
    cube_rotation[i] = cube_rotation[i - 1];
  }
  cube_rotation[i] = current_face;
  rubiks_cube[cube_rotation[4]] = rotate_anti_clockwise(rubiks_cube[cube_rotation[4]])
  rubiks_cube[cube_rotation[5]] = rotate_clockwise(rubiks_cube[cube_rotation[5]])
  display_cube();
}

// Functions to handle particular column's up movements
function handle_turn_col1_up() {
  rubiks_cube[cube_rotation[3]] = rotate_clockwise(rubiks_cube[cube_rotation[3]]);
  faces = [cube_rotation[0], cube_rotation[4], cube_rotation[2], cube_rotation[5]];
  front_face = new Array(3);
  for(var i = 0 ; i < 4 ; i++) {
    if(i == 0) {
      for(var j = 0 ; j < 3 ; j++) {
        front_face[j] = rubiks_cube[faces[0]][j][0];
      }
    } else {
      for(var j = 0 ; j < 3 ; j++) {
        rubiks_cube[faces[i]][j][0] = rubiks_cube[faces[3 - i]][j][0];
      }
    }
  }
}

function handle_turn_col2_up() {
}

function handle_turn_col3_up() {
}

// Functions to handle particular column's down movements
function handle_turn_col1_down() {
}

function handle_turn_col2_down() {
}

function handle_turn_col3_down() {
}

// Functions to handle particular row's left movements
function handle_turn_row1_left() {
}

function handle_turn_row2_left() {
}

function handle_turn_row3_left() {
}

// Functions to handle particular row's right movements
function handle_turn_row1_right() {
}

function handle_turn_row2_right() {
}

function handle_turn_row3_right() {
}

// Function to handle restart of game
function handle_restart() {
  if(!finished) {
    if(confirm("Your progress will be lost. Are you sure to restart the game?")) {
      load_cube();
    }
  } else {
    load_cube();
  }
}

// Initializer function called after the page gets loaded
function initialize_cube() {
  load_cube();
  // Handle the cube to be turned leftside
  $("#turn_cube_left").click(function() {
    handle_turn_cube_left();
  });
  // Handle the cube to be turned upwards
  $("#turn_cube_up").click(function() {
    handle_turn_cube_up();
  });
  // Handle the cube to be turned downwards
  $("#turn_cube_down").click(function() {
    handle_turn_cube_down();
  });
  // Handle the cube to be turned rightside
  $("#turn_cube_right").click(function() {
    handle_turn_cube_right();
  });
  // Handle the particular column's up movements
  $("#turn_col1_up").click(function() {
    handle_turn_col1_up();
  });
  $("#turn_col2_up").click(function() {
    handle_turn_col2_up();
  });
  $("#turn_col3_up").click(function() {
    handle_turn_col3_up();
  });
  // Handle the particular column's down movements
  $("#turn_col1_down").click(function() {
    handle_turn_col1_down();
  });
  $("#turn_col2_down").click(function() {
    handle_turn_col2_down();
  });
  $("#turn_col3_down").click(function() {
    handle_turn_col3_down();
  });
  // Handle the particular row's left movements
  $("#turn_row1_left").click(function() {
    handle_turn_row1_left();
  });
  $("#turn_row2_left").click(function() {
    handle_turn_row2_left();
  });
  $("#turn_row3_left").click(function() {
    handle_turn_row3_left();
  });
  // Handle the particular row's right movements
  $("#turn_row1_right").click(function() {
    handle_turn_row1_right();
  });
  $("#turn_row2_right").click(function() {
    handle_turn_row2_right();
  });
  $("#turn_row3_right").click(function() {
    handle_turn_row3_right();
  });
  // Handle game restart
  $("#restart_game").click(function() {
    handle_restart();
  });
}

// JQuery to handle events after page gets loaded
$(document).ready(function() {
  initialize_cube();
});