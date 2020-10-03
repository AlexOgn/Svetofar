var game_canvas = document.getElementById("game_canvas");
game_canvas.width = window.innerWidth / 2;
game_canvas.height = window.innerHeight / 2;
var game_ctx = game_canvas.getContext("2d");

var game_mouse_x;
var game_mouse_y;

game_canvas.addEventListener("mousemove", (e) => {
    game_mouse_x = e.layerX | e.offsetX;
    game_mouse_y = e.layerY | e.offsetY;
}); 

const is_intersection = (map, y, x) => {
    const can_connect = (diry, dirx) => (get_member(map, y + diry, x + dirx) !== undefined);
    let connections = 0;
    if (can_connect( 0,  1)) connections++;
    if (can_connect( 0, -1)) connections++;
    if (can_connect( 1,  0)) connections++;
    if (can_connect(-1,  0)) connections++;
    return connections >= 3;
}

const draw_street = (ctx, map, size, y, x) => {
    ctx.fillStyle = "#bbb";
    let half = size / 2;
    let quart = half / 2;
    ctx.fillRect(quart, quart, half, half);
    const can_connect = (diry, dirx) => (get_member(map, y + diry, x + dirx) !== undefined);
    const draw_arm = (y, x) => {
        ctx.save();
        ctx.translate(Math.abs(y) * quart, Math.abs(x) * quart);
        y = (y + 1) * y;
        x = (x + 1) * x;
        ctx.fillRect(x * quart , y * quart, half, half);
        ctx.restore();
    };
    if (can_connect( 0,  1)) draw_arm( 0,  1);
    if (can_connect( 0, -1)) draw_arm( 0, -1);
    if (can_connect( 1,  0)) draw_arm( 1,  0);
    if (can_connect(-1,  0)) draw_arm(-1,  0);
    
}

const draw_map = (ctx, map, size) => {
    ctx.save();
    for (let y = 0; y < map.length; y++) {
        for(let x = 0; x < map[y].length; x++) {
            ctx.save();
            ctx.translate(x*size, y*size);
            ctx.fillStyle = "#0fa";
            ctx.fillRect(0, 0, size, size);
            if (get_member(map, y, x) === undefined) {ctx.restore(); continue;}
            draw_street(ctx, map, size, y, x);
            if (map[y][x].type == "Factory")
                ctx.drawImage(assets.factory_img, 0, 0, size, size);
            else if (map[y][x].type == "House")
                ctx.drawImage(assets.house_img, 0, 0, size, size);

            ctx.restore();              
        }
    }
    ctx.restore();
}

const redraw = () => {
    game_ctx.save();
    game_ctx.setTransform(1, 0, 0, 1, 0, 0);
    game_ctx.clearRect(0, 0, game_canvas.width, game_canvas.height);
    game_ctx.restore();
    draw_map(game_ctx, test, 100);
    window.requestAnimationFrame(redraw);
}
redraw();

function get_map_element(ctx, size){
    var matrix = ctx.getTransform();
    var imatrix = matrix.invertSelf();

    var x = game_mouse_x * imatrix.a + game_mouse_y * imatrix.c + imatrix.e;
    var y = game_mouse_x * imatrix.b + game_mouse_y * imatrix.d + imatrix.f;

    var mapx = Math.floor(x / size);
    var mapy = Math.floor(y / size);
    return {x:mapx, y:mapy};
}



let submit = document.getElementById("submit");
submit.onclick = function(){
    document.getElementById("traffic_editor_div").style="display: none";
}
