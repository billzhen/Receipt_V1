
import React, { useContext, useState, useCallback, useRef } from 'react';
import './index.css';
import chatgpt from './chatgpt.png';
import user from './user.png';
import heike from './heike.gif';
import qiu from './qiu.gif';
import jushou from './jushou.gif';
import { useEffect } from 'react';
import axios from 'axios';

export default function App1() {
  const [comments, setComments] = useState([]);
  const [userName, setUserName] = useState("");
  const list_container_id = useRef(null);
  const [count, setCount] = useState(0);

  const getList = (title) => {
    return new Promise((resolve) => {
      axios.post('/search/send', {
        frequency_penalty: 0,
        max_tokens: 2048,
        model: "text-davinci-003",
        presence_penalty: 0,
        message: title,
        temperature: 0.5,
        top_p: 1
      }).then((response) => {
        if (Array.isArray(response.data.choices)) {
          console.log('请求成功', response);
          resolve(response.data.choices);
        } else {
          alert('程序错误');
        }
        // 请求成功
      }).catch((error) => {
        // 请求失败，
        console.log(error);
      });
    })
  }
  const scrollBottom = () => {
    if (!list_container_id.current) {
      return;
    }
    setTimeout(() => {
      list_container_id.current.scrollTop = list_container_id.current.scrollHeight
    }, 0);
  }

  const updateScroll = useCallback(() => {
    scrollBottom()
  })

  const addComment = async (e) => {
    if (userName.trim() === '') {
      alert('请输入问题');
      return;
    }
    setUserName('');
    let index = comments.length;
    comments.push({
      id: Math.random(),
      name: userName,
      contents: []
    });
    setComments(comments);
    setCount(count + 1);
    setTimeout(async () => {
      let responseList = await getList(userName);
      comments[index].contents = responseList;
      setComments(comments);
      setUserName('');
      setCount(0);
    }, 0);
  }


  console.log('comments ==========', comments);
  const renderList = () => {
    return comments.length === 0 ?
      (<div><div className='no-comment'>暂无问题，快去提问吧~</div>
          <img className='chatGPTImg' src={chatgpt}/>
      </div>)
      : (
        <div
          ref={(el) => {
            list_container_id.current = el;
          }}

          className="list_container"
        >
          <ul style={{ color: 'white' }}>
            {comments.map((item, index) => (
              <li key={item.id} style={{ color: 'white' }}>
                {
                  item.name ? (
                    <div
                      className='quiz'>
                      <img className='quiz_avatar' src={user} />
                      <span style={{ marginLeft: 8 }}>提问： {item.name}</span>

                    </div>
                  ) : null
                }
                {
                  item.contents.length ? (
                    <div
                      className='answer'>
                      <img className='quiz_avatar' src={chatgpt} />
                      <ClickFingerTextBoard dataList={item.contents} index={index} updateScroll={updateScroll} />
                    </div>
                  ) : <div>
                    <img className='heike' src={heike} />
                    <div className='answer2'>思考中...</div>
                  </div>
                }
              </li>
            ))}
            <li style={{ color: 'white', height: 100 }}>

            </li>
          </ul>
        </div>
      )
  }
  const handleForm = (e) => {
    setUserName(e.target.value)
  }


  // componentDidUpdate() {
  //   this.scrollBottom()
  // }
  useEffect(() => {
    scrollBottom()
  })
  console.log("Parent here.")

  // const { userName } = this.state;
  return (
    <div className='app_container'>
      {renderList()}
      <div className='input_style'>
        <input
          className='input_quertion'
          type="text"
          placeholder="请输入问题"
          value={userName}
          name="userName"
          onChange={handleForm}
        />
        <div style={{ width: '1%' }}></div>
        <button onClick={addComment} className="confirm_button">发起提问</button>
      </div>
    </div>
  )

}

const ClickFingerTextBoard = React.memo(({ dataList, index, updateScroll }) => {
  console.log('组件内部' + index + "更新");
  const [list, setList] = useState(dataList);
  const [count, setCount] = useState(1);
  const [isALL, setIsAll] = useState(false);
  let innerText = useRef([]);
  let isNeedScrollDown = useRef(true);
  let innerAllText = useRef([]);
  let newList = useRef([]);
  let timer1 = useRef(null)
  let timer2 = useRef(null)

  const delay = (time) => {
    return new Promise((resolve) => {
      let timers = setInterval(() => {
        clearInterval(timers);
        resolve();
      }, time);
    })
  };


  useEffect(() => {
    const calculatedFigures = async () => {
      list.map((item) => {
        innerAllText.current.push(item.text);
      })
    }
    calculatedFigures();
  }, [])


  useEffect(() => {
    console.log('组件-useEffect' + index + "更新");
    const calculatedFigures = async () => {
      list.map((item) => {
        newList.current.push(item.text.split(''));
      })
      timer1.current = setTimeout(async () => {
        for (let i = 0; i < newList.current.length; i++) {
          innerText.current.push([]);
          for (let j = 0; j <= newList.current[i].length; j++) {
            if (newList.current[i][j] === undefined) {
              continue;
            }
            await delay(Math.random() * 100);
            innerText.current[i] = innerText.current[i] + newList.current[i][j];
            if(isNeedScrollDown.current){
              updateScroll();
            }
          }
        }
        setTimeout(() => {
          clearTimeout(timer1.current);
          clearInterval(timer2.current);
        }, 1000)
      }, 0);
    }

    if (list && list.length) {
      calculatedFigures();
      timer2.current = setInterval(() => {
        setCount((count) => count + 1);
      }, 100)
    }
    return () => {
      clearTimeout(timer1.current);
      clearInterval(timer2.current);
    }
  }, [])

  const textquickly = (index) => {
    clearTimeout(timer1.current);
    clearInterval(timer2.current);
    isNeedScrollDown.current = false;
    setTimeout(updateScroll(),0);
    setIsAll(true);
  }
  console.log("here");
  return (
    <div style={{ position: 'relative', width: "100%" }}>
      <div style={{ width: 30 }}> <button onClick={() => { textquickly(index); }} className="quickButton">加速</button></div>
      <div>
        {
          !isALL && innerText.current.length && innerText.current.map((text, index) => {
            return <div style={{ marginLeft: 8, marginBottom: 10 }} key={index}>回答： <pre style={{ width: "100%" }}>{text}</pre></div>
          })
        }
      </div>
      <div>
        {
          isALL && innerAllText.current.length && innerAllText.current.map((text, index) => {
            return <div style={{ marginLeft: 8, marginBottom: 10 }} key={index}>回答： <pre style={{ width: "100%" }}>{text}</pre></div>
          })
        }
      </div>
    </div>
  )
})
