new Vue({
    template: `
        <div>
            <h3 v-if='winner'  style='background-color:blue'>WINNER(Click again to restart)</h3>
            <h3 v-if='loser'  style='background-color:blue'>LOSER(Click again to restart)</h3>
            <h3 v-if='draw'  style='background-color:blue'>DRAW(Click again to restart)</h3>
            <h3 v-if='waiting'  style='background-color:blue'>WAIT FOR OPPONENT</h3>
            <h3 v-if='turn'  style='background-color:lightgreen'>YOUR TURN</h3>
            <h3 v-else  style='background-color:red'>WAIT FOR YOUR TURN</h3>
            <div class="grid-container" v-for = 'm in Grid'>
              <div class="item1" v-on:mouseover='mouseOver' v-on:mouseleave='mouseLeave' v-on:click='updateMsg' :id = 0>{{ m[0] }}</div>
              <div class="item2" v-on:mouseover='mouseOver' v-on:mouseleave='mouseLeave' v-on:click='updateMsg' :id = 1>{{ m[1] }}</div>
              <div class="item3" v-on:mouseover='mouseOver' v-on:mouseleave='mouseLeave' v-on:click='updateMsg' :id = 2>{{ m[2] }}</div>
              <div class="item4" v-on:mouseover='mouseOver' v-on:mouseleave='mouseLeave' v-on:click='updateMsg' :id = 3>{{ m[3] }}</div>
              <div class="item5" v-on:mouseover='mouseOver' v-on:mouseleave='mouseLeave' v-on:click='updateMsg' :id = 4>{{ m[4] }}</div>
              <div class="item6" v-on:mouseover='mouseOver' v-on:mouseleave='mouseLeave' v-on:click='updateMsg' :id = 5>{{ m[5] }}</div>
              <div class="item7" v-on:mouseover='mouseOver' v-on:mouseleave='mouseLeave' v-on:click='updateMsg' :id = 6>{{ m[6] }}</div>
            </div>
        </div>
    `,
    data: {
        lastel : 0,
        col : -1,
        turn : false,
        character: "",
        op_character: "",
        waiting : true,
        winner : false,
        loser : false,
        draw : false,
        Grid : [["_","_","_","_","_","_","_"],["_","_","_","_","_","_","_"],["_","_","_","_","_","_","_"],["_","_","_","_","_","_","_"],["_","_","_","_","_","_","_"],["_","_","_","_","_","_","_"]],
        counter : [5,5,5,5,5,5,5],
        ws: new WebSocket('ws://localhost:5000')    // the ip for the websocket
    },
    methods: {
        refresh()
        {
            this.col = -1
            this.winner = false
            this.loser = false
            this.Grid = [["_","_","_","_","_","_","_"],["_","_","_","_","_","_","_"],["_","_","_","_","_","_","_"],["_","_","_","_","_","_","_"],["_","_","_","_","_","_","_"],["_","_","_","_","_","_","_"]]
            this.counter = [5,5,5,5,5,5,5]   
        },
        checkforvertical(column,row,char)
        {
            let counter=0
            if(row>=4)
            {
                let minu=0
                while(minu<4)
                {
                    if(this.Grid[row-minu][column]==char)
                    {
                        counter=counter+1
                    }
                    minu=minu+1
                }
            }
            return counter
        },
        checkforhorizontal(column,row,char)
        {
            let counter=0
            if(column>=0 && column<=3)
            {
                let minu=0
                while(minu<4)
                {
                    if(this.Grid[row][column+minu]==char)
                    {
                        counter=counter+1
                    }
                    minu=minu+1
                }
            }
            return counter
        },
        mouseOver(e)
        {
            this.col=e.toElement.id
            this.lastel=this.col
            el = document.getElementById(this.col);
            el.style.backgroundColor = 'grey';

        },
        mouseLeave()
        {
            el = document.getElementById(this.lastel);
            el.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';   
        },
        checkdiagnolup(column,row,char)
        {
            let counter=0
            if (this.Grid[row][column] == char) {
                let minu=0
                while(minu<4)
                {
                    if(this.Grid[row-minu][column+minu]==char)
                    {
                        counter=counter+1
                    }
                    minu=minu+1
                }
            }
            return counter
        },
        checkdiagnoldown(column,row,char)
        {
            let counter=0
            if (this.Grid[row][column] == char) {
                let minu=0
                while(minu<4)
                {
                    if(this.Grid[row+minu][column+minu]==char)
                    {
                        counter=counter+1
                    }
                    minu=minu+1
                }
            }
            return counter
        },
        checkforred(char)
        {
            for(var c=0;c<7;c++)
            {
                for(var k=4;k<6;k++)
                {
                    if(this.checkforhorizontal(c,k,char)==3)
                    {
                        if(this.Grid[k][c+1]=="_")
                        {
                            return true
                        }
                    }
                }
            }
            for(var c=0;c<6;c++)
            {
                for(var k=0;k<4;k++)
                {
                    if(this.checkforvertical(k,c,char)==3)
                    {
                        if(this.Grid[k-1][c]=="_")
                        {
                            return true
                        }
                    }
                }
            }
            for(var c=0;c<=3;c++)
            {
                for(var k=3;k<=5;k++)
                {
                    if(this.checkdiagnolup(c,k,char)==3)
                    {
                        if(this.Grid[k-1][c+1]=="_")
                        {
                            return true
                        }
                    }
                }
            }
            for(var c=0;c<=3;c++)
            {
                for(var k=0;k<=2;k++)
                {
                    if(this.checkdiagnoldown(c,k,char)==3)
                    {
                        if(this.Grid[k+1][c+1]=="_")
                        {
                            return true
                        }
                    }
                }
            }
            return false
        },
        checkfull(char)
        {
            for(var c=0;c<7;c++)
            {
                for(var k=4;k<6;k++)
                {
                    if(this.checkforhorizontal(c,k,char)==3)
                    {
                        return true
                    }
                }
            }
            for(var c=0;c<6;c++)
            {
                for(var k=0;k<4;k++)
                {
                    if(this.checkforvertical(k,c,char)==4)
                    {
                        return true
                    }
                }
            }
            for(var c=0;c<=3;c++)
            {
                for(var k=3;k<=5;k++)
                {
                    if(this.checkdiagnolup(c,k,char)==4)
                    {
                        return true
                    }
                }
            }
            for(var c=0;c<=3;c++)
            {
                for(var k=0;k<=2;k++)
                {
                    if(this.checkdiagnoldown(c,k,char)==4)
                    {
                        return true
                    }
                }
            }
            return false
        },
        checkfordraw()
        {
            for(var i=0;i<6;i++)
            {
                for(var j=0;j<7;j++)
                {
                    if(this.Grid[i][j]=="_")
                    {
                        return false
                    }
                }
            }
            return true
        },
        async updateMsg(e) {
            this.col=e.toElement.id
            // el = document.getElementById(this.);
            // el.style.backgroundColor = 'grey';
            if(this.loser==true || this.winner==true)
            {
                if(this.winner==true)
                {
                    this.turn=true
                }
                else
                {
                    this.turn=false
                }
                this.refresh()
            }
            if(this.turn == true && this.counter[this.col]>=0 && this.col<7 && this.col>=0)
            {
                this.ws.send(JSON.stringify(this.col))
            }
        }
    },
    mounted()
    {
        // console.log("mounted")
        this.ws.onmessage = event => {
            event=JSON.parse(event.data)
                this.character=event.character1
                this.op_character = event.character2
                var temp_updatecol = event.othercol
                this.waiting = event.waiting
                if(this.waiting==false)
                {
                    if(temp_updatecol >= 0)
                    {
                        this.Grid[this.counter[temp_updatecol]][temp_updatecol]= this.op_character
                        this.counter[temp_updatecol] = this.counter[temp_updatecol] - 1
                    }
                    if(this.col >= 0 && this.turn==true)
                    {
                        this.Grid[this.counter[this.col]][this.col]=this.character
                        this.counter[this.col] = this.counter[this.col] - 1
                    }
                    this.turn = event.turn
                    if(this.checkfull(this.character))
                    {
                        this.winner=true
                    }
                    else if(this.checkfull(this.op_character))
                    {
                        this.loser=true
                    }
                    else if(this.checkfordraw())
                    {
                        this.draw=true
                    }
                    if(this.checkforred(this.op_character))
                    {
                        el = document.getElementById(temp_updatecol);
                        el.style.backgroundColor = 'red';
                    }
                }
            }
            
    }
}).$mount('#root')
