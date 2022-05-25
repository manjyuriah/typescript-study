type Store={
  currentPage: number;
  feeds: [];
}
type NewsFeed={
  id: number;
  comments_count: number;
  title: string;
  read: boolean;
}

const container: HTMLElement | null=document.getElementById('root');
const ajax: XMLHttpRequest = new XMLHttpRequest(); //서버와의 통신-ajax
const content=document.createElement('div')
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
//@id = 마킹 -> 임의로 적고 나중에 바꿀 부분
const store = {
  currentPage: 1,
  feeds: [],
};

function getData(url) {
  ajax.open('GET', url, false);
  ajax.send();
    //응답값을 객체로 바꾸기
    return JSON.parse(ajax.response);
  }
//읽었냐 안읽었냐 확인 함수
function makeFeeds(feeds) {
  for (let i = 0; i < feeds.length; i++) {
    feeds[i].read = false;
  }

  return feeds;
}

//라우터에서 해당 함수로 글 목록 불러옴
function newsFeed(){//함수는 호출해야 출력됨. 이것만 있음 아무거도 안뜨지
    // const newsFeed= getData(NEWS_URL)
    let newsFeed= store.feeds; //읽음을 나타내기위해 전역변수로 쓰이는 store안에 feeds를 넣음
    //그리고 출력되는애를 store의 feed로 이관했는데 일단 store.feeds는 비어있으니까 안무거도 안뜸
    //최초의 한번은 getData로 불러와야함
    const newsList=[];
    //template구조로 코드를 짜면 직관적으로 UI구조 파악에 쉬움
    //마킹된 위치로 어떤 데이터가 어디 들어갈지도 파악 가능
    let template=`
    <div class="bg-gray-600 min-h-screen">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                < Previous
              </a>
              <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                Next >
              </a>
            </div>
          </div> 
        </div>
      </div>
      <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}        
      </div>
    </div>
    `;
    //최초로 피드 읽어오는 코드
    if (newsFeed.length === 0) {
      newsFeed = store.feeds = makeFeeds(getData(NEWS_URL));
    }
    // newsList.push('<ul>')
    //template에는 구조와 데이터 위치만
    
    for(let i=(store.currentPage-1)*10; i<(store.currentPage*10); i++){
        // const div=document.createElement('div');
        newsList.push(`
        <div class="p-6 ${newsFeed[i].read ? 'bg-gray-300' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-blue-50">
        <div class="flex">
          <div class="flex-auto">
            <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-blue-400 rounded-full px-0 py-2">${newsFeed[i].comments_count}</div>
          </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
            <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
            <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
          </div>  
        </div>
      </div>    
        `)
    }
    //template를 넣는과정에서 계산코드등 삽입 -> 복잡도를 줄일 수 있음
    template=template.replace('{{__news_feed__}}',newsList.join(''))
    template=template.replace('{{__prev_page__}}',store.currentPage > 1 ?store.currentPage-1 :1)
    template=template.replace('{{__next_page__}}',store.currentPage +1)
        // newsList.push('</ul>')
        // newsList.push(`
        //     <div>
        //         <a href="#/page/${store.currentPage > 1 ?store.currentPage-1 :1}">이전 페이지</a>
        //         <a href="#/page/${store.currentPage+1}">다음 페이지</a>
        //     </div>
        // `)
        //배열 형태의 newsList를 join를 이용해 하나의 문자열로 만들어 innerHTML로 넣음
        // container.innerHTML=newsList.join('')
    container.innerHTML=template;
        
}

// const ul=document.createElement('ul');

function newsDetail() {
  const id = location.hash.substr(7);
  const newsContent = getData(CONTENT_URL.replace('@id', id))
    // const title=this.document.createElement('h1');
    let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>${newsContent.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsContent.content}
        </div>

        {{__comments__}}

      </div>
    </div>
  `;
  for(let i=0; i < store.feeds.length; i++) {
    if (store.feeds[i].id === Number(id)) {
      store.feeds[i].read = true;
      break;
    }
  }

  function makeComment(comments, called = 0) {
    const commentString = [];

    for(let i = 0; i < comments.length; i++) {
      commentString.push(`
        <div style="padding-left: ${called * 40}px;" class="mt-4">
          <div class="text-gray-400">
            <i class="fa fa-sort-up mr-2"></i>
            <strong>${comments[i].user}</strong> ${comments[i].time_ago}
          </div>
          <p class="text-gray-700">${comments[i].content}</p>
        </div>      
      `);

      if (comments[i].comments.length > 0) {//대댓글 호출할때마다 called변수+1
        commentString.push(makeComment(comments[i].comments,called+1));
      }
    }

    return commentString.join(''); //재귀호출(댓글에 대댓에 끝을 알 수 없는 구조에서 사용)
  }

  container.innerHTML = template.replace('{{__comments__}}', makeComment(newsContent.comments));
}

    // div.innerHTML=`
    // <li>
    //     <a href="#${newsFeed[i].id}">${newsFeed[i].title}(${newsFeed[i].comments_count})</a>
    // </li>
    // `
    //=
    // a.href=`#${newsFeed[i].id}`;
    // a.innerHTML=`${newsFeed[i].title}(${newsFeed[i].comments_count})`;

    // a.addEventListener('click',function(){})//여러개의 a태그에 다 걸어줘야함+기술적 문제

    //앵커태그에 넣은 # = a태그의 name속성과 같은 해쉬 이름이 들어오면 그 위치로 스크롤링됨
    //해당 해시가 바꼈을때 발생하는 이벤트 hashchange
    // li.appendChild(a);
    // ul.appendChild(li);

    //ul태그 하위엔 li가 와야하는데 현재 li는 div 안에 있음
    // ul.appendChild(div.children[0]);

        // const li=document.createElement('li');
        // const a=document.createElement('a');

// container.appendChild(ul);
// container.appendChild(content);
function router() {
  const routePath = location.hash;

  if (routePath === '') {
    newsFeed();
  } else if (routePath.indexOf('#/page/') >= 0) {
    store.currentPage = Number(routePath.substr(7));
    newsFeed();
  } else {
    newsDetail()
  }
}

window.addEventListener('hashchange', router);

router();
