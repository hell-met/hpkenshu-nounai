'use strict';
{

  //-----ページURL-----
  const pageURL = "https://hell-m.com/hpkenshu-nounai";

  //-----メンバー情報管理配列-----

  const memberList = [
    ["米村姫良々","http://cdn.helloproject.com/img/artist/m/66ae679e11ce3d82a65921c801bcad62b052fd94.jpg"],

    ["山田苺","http://cdn.helloproject.com/img/artist/m/937288a8a861c299123d57a0f3eaeb6975e3c57c.jpg"],

    ["中山夏月姫","http://cdn.helloproject.com/img/artist/m/1fbda0b5fe7ed64a4e23c39e131527c32abdb0f8.jpg"],

    ["為永幸音","http://cdn.helloproject.com/img/artist/m/6e219e310c883ccd1d5efd6ef3050131854d21bf.jpg"],

    ["窪田七海","http://cdn.helloproject.com/img/artist/m/81c2ab229b44e22f1a769dfdb982cec7d93caf0c.jpg"],

    ["松原ユリヤ","http://cdn.helloproject.com/img/artist/m/b09f556aaf922648ae971f8519e5a34731d93e4b.jpg"],

    ["斉藤円香","http://cdn.helloproject.com/img/artist/m/e71225edf7dad29687a51dfd468fe23c23d36c41.jpg"],

    ["小野田華凜","http://cdn.helloproject.com/img/artist/m/5a4861dda05051f0bbab91ac2c9dcb438acc79ef.jpg"],

    ["広本瑠璃","http://cdn.helloproject.com/img/artist/m/16869970e564919b6d2187c4219292e7f275bef1.jpg"],

    ["橋田歩果","http://cdn.helloproject.com/img/artist/m/b66cf91cf1934509d1a7f3aa6bb07d2a50070c83.jpg"],

    ["西﨑美空","http://cdn.helloproject.com/img/artist/m/f8db9ca3ee4d8a2df50a5b3f55c81bccc70768d1.jpg"],

    ["平山遊季","http://cdn.helloproject.com/img/artist/m/5664af7ab55e2aa2241cc27b3b89180e1742f963.jpg"],

    ["北原もも","http://cdn.helloproject.com/img/artist/m/6d560bb0703d3fcd9294630c49306fe2845bd3a5.jpg"],

    ["江端妃咲","http://cdn.helloproject.com/img/artist/m/60bb7aeeb99148d3c9bf2e8aae6670279d3e1953.jpg"],

    ["豫風瑠乃","http://cdn.helloproject.com/img/artist/m/caa4e5d4d5db311086614db54fe815229a25bf1d.jpg"],

    ["村越彩菜","http://cdn.helloproject.com/img/artist/m/1af02fa116659696b43b752012247524228c29f5.jpg"],

    ["植村葉純","http://cdn.helloproject.com/img/artist/m/b124593fb45e913e01bcd36e4d5f89494f333af6.jpg"],

    ["石栗奏美","http://cdn.helloproject.com/img/artist/m/d460f3a1553d62407e0720b7da14ff6df5927259.jpg"],

    ["河野みのり","http://cdn.helloproject.com/img/artist/m/8123a78c4e4a13d7a39e25b67581ca742b4f2f96.jpg"],

    ["西村風凛","http://cdn.helloproject.com/img/artist/m/537e548c6a04cd916fd4bf042f551811f2965853.jpg"]
  ]

  //-----初期設定-----

  function Member(name,picture){ //メンバーオブジェクト作成用コンストラクター関数
    this.name = name; 
    this.picture = picture; //メンバー画像のURL
    this.lowPoint = 0; //最低推しメンバーと比較した他メンバーのポイント
    this.highPoint = 0; //最高推しメンバーと比較した他メンバーのポイント
    this.point = 0;
    this.per = 0; //ポイントから算出した好みの割合
    this.rank = 0; //順位
  }

  let totalPoint = 0;
  const volumeMax = 100; //スライダーの最大値
  const voliumeStep = 5; //スライダーの1目盛あたりの点数

  let finished = 0; //進行度
  let finish = 0; //1問あたりの進行度
  let totalQ = 0; //総質問数

  let _id = 0; //メンバー数カウント用
  let listMembers = []; //メンバー情報の配列
  let members = []; //メンバーID管理用配列
  memberList.forEach(member => {
    const name = member[0];
    const picture = member[1];
    listMembers[_id] = new Member(name, picture);
    members[_id] = _id;
    _id++;
  })

  let likeMembers = [];
  let anotherMembers = members.slice();

  var board = document.getElementById('board');//パネル表示用エリア
  var btn = document.getElementById('btn');//ボタン表示用エリア

  function suffle(arr){ //配列シャッフル用関数
    for(let i = arr.length - 1; i>0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [arr[j],arr[i]] = [arr[i], arr[j]];
    }
    return arr;
  }

  function scrollToTop() {
    scrollTo(0, 0);
   }

  //-----推しメン選択-----

  class likeMemberSelect{
    constructor(){

      const memberboard = document.createElement("ul");
      memberboard.setAttribute("id","member-board");


      inst.textContent = "とくに好きなメンバーは？（複数可）";

      class Panel { //メンバーごとのパネル表示
        constructor(id) {
          this.el = document.createElement('li');
          this.el.innerHTML =`<img src="${listMembers[id].picture}"><div>${listMembers[id].name}</div>`;
          this.el.addEventListener('click',() => {
            this.check(id);
          });
        }

        getEl(){
          return this.el;
        }

        check(id){
          if(this.el.classList.contains('pressed') == true) {
            this.el.classList.remove('pressed');
            var result = likeMembers.indexOf(id);
            likeMembers.splice(result,1);
          }else{
            this.el.classList.add('pressed');
            likeMembers.push(id);
          }
        }
      }


      class PanelArea { //メンバーパネル全体の表示
        constructor() {
          this.panels = [];
          members.forEach(id => {
            this.panels.push(new Panel(id));
          })
          this.setup();

          board.appendChild(memberboard);
        }

        setup() {
          this.panels.forEach(panel => {
            memberboard.appendChild(panel.getEl());
          });
        }

      }

      function calFinish(){ // 質問数の計算
        if(likeMembers.length <= 1){

          totalQ = members.length - 1;

        } else {
          let likeQ = 0;
          let likeIndex = 1;
          while(likeIndex < likeMembers.length){
            likeQ += likeIndex;
            likeIndex++;
          }

          const anotherQ = (members.length - likeMembers.length) * 2;

          totalQ = likeQ + anotherQ;
        }

        finish = 100 / totalQ;
      }

      function likeSelectDone(){ //推しメン選択の決定ボタン用イベント
        if(likeMembers[0]==null){
          inst.textContent = "※メンバーが選択されていません";
        } else if(likeMembers.length == members.length){
          inst.textContent = "※全員を選択することはできません";
          board.textContent = null;
          btn.textContent = null;
          const likeSelect = new likeMemberSelect();
        } else {
          likeMembers.forEach(likeMember => { //推し以外のメンバー配列作成
            const _likeMemberId = anotherMembers.indexOf(likeMember);
            anotherMembers.splice(_likeMemberId,1);
          })
          likeMembers = suffle(likeMembers); //推しメン配列シャッフル
          anotherMembers = suffle(anotherMembers); //推し以外メン配列シャッフル

          doneButton.removeEventListener('click',likeSelectDone);//決定ボタンからイベント削除

          calFinish(); //質問数の計算
          

          if(likeMembers.length == 1){
            listMembers[likeMembers[0]].point = 100;
            totalPoint = 100;
            const anotherSort = new AnotherMemberSort();
          } else {
            const likeSort = new likeMemberSort();
          }
        }
      }

      const panelarea = new PanelArea();

      const doneButton = document.createElement('div');
      doneButton.setAttribute("id","button");
      doneButton.textContent = "決定";
      btn.appendChild(doneButton);
      doneButton.addEventListener('click',likeSelectDone);

    }
  }

  const likeSelect = new likeMemberSelect();


  //-----推しメン同士の比較-----

  class likeMemberSort{
    constructor(){

      let mainMember = 0;
      let vsMember = 1;

      class LikeBlockArea{
        constructor(){
          scrollToTop()
          board.textContent = null;
          inst.textContent = `好きな割合は？ (進行度:${Math.floor(finished)}%)`;
          this.boardDisplay(mainMember,vsMember);
          this.sliderDisplay();         
        }


        boardDisplay(left,right){
          const choiceboard = document.createElement("ul");
          choiceboard.setAttribute("id","choice-board");
          const leftMember = document.createElement('li');
          leftMember.setAttribute("id","leftmember");
          leftMember.innerHTML =`<img src="${listMembers[likeMembers[left]].picture}"><div>${listMembers[likeMembers[left]].name}</div>`;

          const rightMember = document.createElement('li');
          rightMember.setAttribute("id","rightmember");
          rightMember.innerHTML =`<img src="${listMembers[likeMembers[right]].picture}"><div>${listMembers[likeMembers[right]].name}</div>`;
          choiceboard.appendChild(leftMember);
          choiceboard.appendChild(rightMember);
          board.appendChild(choiceboard);
        }

        sliderDisplay(){
          const volumeboard = document.createElement('div');//スライダー用ボード
          volumeboard.setAttribute("id","volume-board");
          
          const volumeValue = document.createElement('div');//スライダーの値表示用
          volumeValue.setAttribute("id","volume-value");

          const leftValue = document.createElement('p');
          const rightValue = document.createElement('p');
          leftValue.setAttribute("id","left-value");
          rightValue.setAttribute("id","right-value");
          leftValue.textContent = "50%";
          rightValue.textContent = "50%";

          const volume = document.createElement('input');
          volume.classList.add('volume');
          volume.type = 'range';
          volume.min = 0;
          volume.max = volumeMax;
          volume.step = voliumeStep;
          volume.id = "vol";
          
          const rangeValue = function(){
            leftValue.innerHTML = `${volume.value}%`;
            rightValue.innerHTML = `${100 - volume.value}%`;
          }
          
          volume.addEventListener('input',rangeValue);

          volumeboard.appendChild(leftValue);
          volumeboard.appendChild(volume);
          volumeboard.appendChild(rightValue);
          board.appendChild(volumeboard);
        }

      }

      function calLikePer(num){
        listMembers[num].likePer = Math.floor((listMembers[num].point / totalPoint)*volumeMax);
      }

      function likeSortDone(){//決定ボタンを押したときの処理
        
        //スライダ-の値を取得、代入
        const vol = document.getElementById('vol');

        listMembers[likeMembers[mainMember]].point += parseInt(vol.value);
        listMembers[likeMembers[vsMember]].point += (volumeMax - parseInt(vol.value));

        totalPoint += volumeMax;

        //進行度の計算
        finished += finish;
        console.log(finished);

        vsMember++;
        board.textContent = null;

        if(vsMember >= likeMembers.length){
          //vsMemberがもうないとき
          mainMember++;
          vsMember = mainMember +1;

          if(mainMember >= likeMembers.length - 1){
            //mainMemberがもうないとき

            likeMembers.forEach(likeMember => {
              calLikePer(likeMember);
            });

            likeMembers.sort(function(a,b){
              if(listMembers[a].point < listMembers[b].point) return -1;
              if(listMembers[a].point > listMembers[b].point) return 1;
              return
            });

            doneButton.removeEventListener('click',likeSortDone);
            const anotherSort = new AnotherMemberSort();


          } else {
            //mainMemberがまだあるとき
            const likearea = new LikeBlockArea();
          }

        } else {
          //vsMemberがまだあるとき
          const likearea = new LikeBlockArea();
        }

      }

      const likearea = new LikeBlockArea();

      const doneButton = document.getElementById('button');
      doneButton.addEventListener('click',likeSortDone);

    }

  }


  //-----推しメンとその他メンバーの比較-----

  class AnotherMemberSort{
    constructor(){

      let mainMember = 0;
      let vsMember = 0;

      class AnotherBlockArea{
        constructor(){
          scrollToTop()
          board.textContent = null;
          inst.textContent = `好きな割合は？ (進行度:${Math.floor(finished)}%)`;
          this.boardDisplay(mainMember,vsMember);
          this.sliderDisplay();       
        }

        boardDisplay(left,right){
          const choiceboard = document.createElement("ul");
          choiceboard.setAttribute("id","choice-board");
          const leftMember = document.createElement('li');
          leftMember.setAttribute("id","leftmember");
          leftMember.innerHTML =`<img src="${listMembers[likeMembers[left]].picture}"><div>${listMembers[likeMembers[left]].name}</div>`;

          const rightMember = document.createElement('li');
          rightMember.setAttribute("id","rightmember");
          rightMember.innerHTML =`<img src="${listMembers[anotherMembers[right]].picture}"><div>${listMembers[anotherMembers[right]].name}</div>`;
          choiceboard.appendChild(leftMember);
          choiceboard.appendChild(rightMember);
          board.appendChild(choiceboard);
        }

        sliderDisplay(){
          const volumeboard = document.createElement('div');//スライダー用ボード
          volumeboard.setAttribute("id","volume-board");

          const volumeValue = document.createElement('div');//スライダーの値表示用
          volumeValue.setAttribute("id","volume-value");

          const leftValue = document.createElement('p');
          const rightValue = document.createElement('p');
          leftValue.setAttribute("id","left-value");
          rightValue.setAttribute("id","right-value");
          leftValue.textContent = "50%";
          rightValue.textContent = "50%";

          const volume = document.createElement('input');
          volume.classList.add('volume');
          volume.type = 'range';
          volume.min = 0;
          volume.max = volumeMax;
          volume.step = voliumeStep;
          volume.id = "vol";

          const rangeValue = function(){
            leftValue.innerHTML = `${volume.value}%`;
            rightValue.innerHTML = `${100 - volume.value}%`;
          }

          volume.addEventListener('input',rangeValue);

          volumeboard.appendChild(leftValue);
          volumeboard.appendChild(volume);
          volumeboard.appendChild(rightValue);
          board.appendChild(volumeboard);
        }

      }

      function anotherSortDone(){
        
        const vol = document.getElementById('vol');

        //進行度の計算
        if(vol.value >= volumeMax && mainMember <= 0 && likeMembers.length != 1){
          finished += finish * 2;
        } else {
          finished += finish;
        }

        if(mainMember <= 0 || likeMembers.length <= 1){

          if( vol.value <= 0){
            const _point = parseInt(listMembers[likeMembers[mainMember]].point*9.9);
            listMembers[anotherMembers[vsMember]].lowPoint = _point;
          } else {
            const _point = parseInt((listMembers[likeMembers[mainMember]].point*(volumeMax-vol.value))/vol.value);
            listMembers[anotherMembers[vsMember]].lowPoint = _point;
          }

        } else {
          const _point = parseInt((listMembers[likeMembers[mainMember]].point*(volumeMax-vol.value))/vol.value);
          listMembers[anotherMembers[vsMember]].highPoint = _point;
        }

        vsMember++;
        board.textContent = null;

        if(vsMember >= anotherMembers.length){

          if(mainMember == likeMembers.length -1){

            anotherMembers.forEach(anotherMember => {

              if(likeMembers.length <= 1){
                listMembers[anotherMember].point = listMembers[anotherMember].lowPoint;
              }else{
                listMembers[anotherMember].point = (listMembers[anotherMember].lowPoint + listMembers[anotherMember].highPoint) / 2;
              }

              totalPoint += listMembers[anotherMember].point;

            })
            
            btn.textContent = null;
            const result = new Result();


          } else {
            mainMember = likeMembers.length - 1;
            vsMember = 0;
            let highanotherMembers = [];

            anotherMembers.forEach(anotherMember => { 
              if(listMembers[anotherMember].lowPoint > 0){
                const _anotherMemberId = anotherMembers.indexOf(anotherMember);
                highanotherMembers.push(anotherMembers[_anotherMemberId]);
              }
            });

            anotherMembers = highanotherMembers;
            const anotherarea = new AnotherBlockArea();
          }

        } else{
          const anotherarea = new AnotherBlockArea();
        }

      }

      const anotherarea = new AnotherBlockArea();

      const doneButton = document.getElementById('button');
      doneButton.addEventListener('click',anotherSortDone);



    }
  }

  class Result{
    constructor(){
      scrollToTop()

      inst.textContent = `結果 (進行度:100%)`;
      let chartData = [["name","point"]];

      const chartText = document.createElement("div");
      chartText.setAttribute("id","chart-text");
      chartText.innerHTML = "<a>あなたの推し脳内は…</a>";
      board.appendChild(chartText);

      const resultTable = document.createElement('table');
      resultTable.setAttribute("id","result-table");

      function calPer(){
        members.forEach(member => {
          listMembers[member].per = Math.floor((listMembers[member].point / totalPoint)*10000)/100;    
        });
      }

      function calRank(){
        let rankIndex = 1;
        let prevMember = -1;
        members.forEach(member => {
          if(rankIndex == 1){
            listMembers[member].rank = rankIndex;
          }else if(listMembers[member].point == listMembers[prevMember].point){
            listMembers[member].rank = listMembers[prevMember].rank;
          } else {
            listMembers[member].rank = rankIndex;
          }
          prevMember = member;
          rankIndex++;

          chartData.push([listMembers[member].name,listMembers[member].point]);
        })
      }

      function resultListDisplay(){
        members.forEach(member => {
          const record = document.createElement('tr');
          record.innerHTML = `<th>${listMembers[member].rank}位</th><td><img src="${listMembers[member].picture}" width="${80*(listMembers[member].per/listMembers[members[0]].per)}%"></td><td>${listMembers[member].name}</td><td>${listMembers[member].per}%</td>`;

          resultTable.appendChild(record);
        });
        board.appendChild(resultTable); //要素をboardに追加
      }

      function pieChartDisplay(){

        const piechart = document.createElement("div");
        piechart.setAttribute("id","piechart");

        google.load("visualization", "1", {packages:["corechart"]});
        google.setOnLoadCallback(drawChart);
        function drawChart() {
           var data = google.visualization.arrayToDataTable(//グラフデータの指定
             chartData
          );
          var options = { //オプションの指定
          pieSliceText: 'label',
          // title: 'あなたの推し脳内は…',
          width: "100%",
          height: 300,
          'titleTextStyle': { color:'#444444', fontSize: 13}
          };
          var chart = new google.visualization.PieChart(document.getElementById('piechart')); //グラフを表示させる要素の指定
          chart.draw(data, options);
        }

        board.appendChild(piechart);

      }
      
      
      function tweetButton(){
        const tweet = document.createElement("div");
        tweet.setAttribute("id","tweet-btn");
        const tw_contents = (`私のハロプロ研修生ヲタク脳は…%0a%0a【${listMembers[members[0]].rank}位】${listMembers[members[0]].name}%20-%20${listMembers[members[0]].per}％%0a【${listMembers[members[1]].rank}位】${listMembers[members[1]].name}%20-%20${listMembers[members[1]].per}％%0a【${listMembers[members[2]].rank}位】${listMembers[members[2]].name}%20-%20${listMembers[members[2]].per}％
        %0a%0a%23ハロプロ研修生ヲタク脳内診断%0a`);
        // const hash = ("ハロプロ研修生ヲタク脳内診断");

        tweet.innerHTML = `<a href="https://twitter.com/share?&url=${pageURL}&text=${tw_contents}&count=none&lang=ja" target="_blank" rel="noopener noreferrer"><span id = "tweet">この結果をツイート</span></a>`;

        btn.appendChild(tweet);

      }

      members.sort(function(a,b){
        if(listMembers[a].point > listMembers[b].point) return -1;
        if(listMembers[a].point < listMembers[b].point) return 1;
        return
      });

      calRank(); //順位を計算
      calPer(); //割合を計算

      pieChartDisplay(); //円グラフを表示
        
      resultListDisplay(); //ソート結果を表示

      tweetButton(); //結果をツイート
      

    }

  }




}