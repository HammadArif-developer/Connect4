var gfg = new Array(6); 
// Loop to create 2D array using 1D array 
for (var i = 0; i < gfg.length; i++) { 
    gfg[i] = new Array(7); 
} 
  
var h = 0; 
  
// Loop to initilize 2D array elements. 
for (var i = 0; i < 6; i++) { 
    for (var j = 0; j < 7; j++) { 
        gfg[i][j] = "1"; 
    } 
}
var gfg2 = new Array(6); 
// Loop to create 2D array using 1D array 
for (var i = 0; i < gfg2.length; i++) { 
    gfg2[i] = new Array(7); 
} 
  
var h = 0; 
  
// Loop to initilize 2D array elements. 
for (var i = 0; i < 6; i++) { 
    for (var j = 0; j < 7; j++) { 
        gfg2[i][j] = "2"; 
    } 
}
gfg=gfg2
// for (var i = 0; i < 6; i++) { 
//     for (var j = 0; j < 7; j++) { 
//         console.log(gfg[i][j]) 
//     } 
//     console.log("lol............")
// }
console.log(gfg)

