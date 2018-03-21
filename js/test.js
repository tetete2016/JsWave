(function(){
    const canvas = document.createElement('canvas');
    canvas.width=500;
    canvas.height=500;
    document.body.appendChild(canvas);
    const gpu = new GPU({ mode: 'gpu' });
    var u=[];
    var dudt=[];
    var csq=1;
    var deltatime=0.7;
    const opt = {
        output: [256,256]
    };
    for(var i=0;i<256;i++){
        u.push([]);
        dudt.push([]);
        for(var j=0;j<256;j++){
            u[i].push(0);
            dudt[i].push(0);
        }
    }
    u[128][128]=1;
    const nabla = gpu.createKernel(function(a,c,dt) {
        return (a[this.thread.x][this.thread.y+1]-2*a[this.thread.x+1][this.thread.y+1]+a[this.thread.x+2][this.thread.y+1]
                +a[this.thread.x+1][this.thread.y]-2*a[this.thread.x+1][this.thread.y+1]+a[this.thread.x+1][this.thread.y+2])*c*dt;
    }).setOutput([254, 254]);
    const integral=gpu.createKernel(function(a,b,dt) {
        return a[this.thread.x][this.thread.y]+b[this.thread.x][this.thread.y]*dt;
    }).setOutput([256, 256]);
    var n=create2d();
    var n1;
    const gpu1 = new GPU({canvas});
    const graphic=gpu1.createKernel(function(v,m){
        this.color(v[this.thread.x][this.thread.y]*m+0.5,v[this.thread.x][this.thread.y]+0.5,v[this.thread.x][this.thread.y]+0.5,1);
    }).setOutput([256, 256])
  .setGraphical(true);
    var count=0;
    
    loop();
    function loop(){
        count++;
        u[128][128]=Math.sin(count*deltatime);
        var n1=nabla(u,csq,deltatime);
        for(var i=0;i<254;i++){
            for(var j=0;j<254;j++){
                n[i+1][j+1]=n1[i][j];
            }
        }
        dudt=integral(dudt,n,deltatime);
        u=integral(u,dudt,deltatime);
        graphic(u,1);
        
        requestAnimationFrame(loop);
    }
})();
function create2d(){
    var a=[];
    for(var i=0;i<256;i++){
        a.push([]);
        for(var j=0;j<256;j++){
            a[i].push(0);
        }
    }
    return a;
}