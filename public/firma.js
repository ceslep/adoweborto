var click=false;
$(document).ready(()=>{
         $("#myCanvas").on("touchstart mousedown",function(event){
            
            
            click=true;
            let x;
            let y;
            if(event.offsetX == undefined){ // para firefox
                x = event.pageX - $(this).offset().left;
                y = event.pageY - $(this).offset().top;
                
            }
            else{ // chrome
              x = event.offsetX;
              y = event.offsetY;
            }
            antx=x;
            anty=y;
            
          });
          
          
          $("#myCanvas").on("touchend mouseup",function(event){
            
            click=false;
            let x;
            let y;
            if(event.offsetX == undefined){ // para firefox
                x = event.pageX - $(this).offset().left;
                y = event.pageY - $(this).offset().top;
            }
            else{ // chrome
              x = event.offsetX;
              y = event.offsetY;
            }
            antx=x;
            anty=y;
            
          });
          
            $("#myCanvas").on("touchmove mousemove",function(event){
            
            if (click){
            let x;
            let y;
            if(event.offsetX == undefined){ // para firefox
                x = event.pageX - $(this).offset().left;
                y = event.pageY - $(this).offset().top;
            }
            else{ // chrome
              x = event.offsetX;
              y = event.offsetY;
            }
            
            x1=x;
            y1=y;
           // console.log(x1);
          //  console.log($(this).offset().left);
            $('canvas').drawPath({
                  strokeStyle: '#000',
                  strokeWidth: 3,
                  p1: {
                  type: 'line',
                  x1: x1, y1: y1,
                  x2: antx, y2: anty
                  
                  },
                  
            });	
            antx=x1;
            anty=y1;
            }
          });
          
});