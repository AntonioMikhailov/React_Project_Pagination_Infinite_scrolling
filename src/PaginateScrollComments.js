import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
export default function PaginateScrollComments() {
  const [comments, setComments] = useState([]);  
  // state для номера текущей страницы
  const [currentPage, setCurrentPage] = useState(1);
  // state для слежения за подгрузкой данных - от момента отправки запроса и до момента получения ответа - изначально true но после получения данных первой страницы меняется на false после прокрутки в самый низ, снова становистя true  и делается следующий запрос
  const [fetching, setFetching] = useState(true);
  // state для определения последних фото в массиве - эти данные можно получить из заголовка ответа в поле x-total-count: 500
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    if (fetching) {
   // Номер страницы и количество отображаемых элементов будем менять прямо в строке URL - здесь 10 элементов на странице
        // Если использовать Fetch то сразу нельзя получить totalCount - поэтому Axios
      axios.get(`https://jsonplaceholder.typicode.com/comments?_limit=10&_page=${currentPage}`)
        .then((response) => {
        //чтобы не затирать старые данные - разворачиваем массив и добавляем к старым новые  
          setComments([...comments, ...response.data]);
          setCurrentPage((prev) => prev + 1);
         // console.log(response.headers["x-total-count"]); // 5000 
          setTotalCount(response.headers["x-total-count"]); // получаем сколько всего элементов есть в массиве
        })
        .finally(() => {
          // в конце загрузки первых 10 страниц надо изменить state на false чтобы остановить загрузку иначе будет бесконечно загружать т.к. UseEffect будет срабатывать
          setFetching(false);  
        });
    }
  }, [fetching, comments, currentPage]); // ESLint ругается на аргументы - убрать можно и также работает. Будет зависеть от состояния fetching - и при true будет запускать запрос
  // этот эффект следит за скролом страницы и запускает ф. scrollHandler
  useEffect(() => {
    document.addEventListener("scroll", scrollHandler); 
    return function () {
      // удаляем слушатель после работы
      document.removeEventListener("scroll", scrollHandler); //  
    };
  }, [totalCount]);  
  // определяем высоту страницы, текущее положение скрола от верха, и высота видимой части контента
  const scrollHandler = (e) => {
if (
  e.target.documentElement.scrollHeight -
    (e.target.documentElement.scrollTop + window.innerHeight) < 100 &&  comments.length < totalCount
) {
    // Второе условие && comments.length < totalCount - должно также следить когда закончатся все фото
     setFetching(true);
    }
  };
  return (
    <>
  <main className="container">
    <header className="header">
      <h3>Получаем посты с JSON Placeholder</h3> 
      <div>При скроле в самый низ подгрузятся следующие посты</div>
    </header>
    <div className="contentWrapper">
      {comments.map(item => {
        return (
          <div className="itemWrapper" key={item.id}>
            <p>post - {item.id}</p>
            <div className="itemEmail">{item.email}</div>
            <div className="listItem">{item.body}</div>
          </div>
        );
      })}
    </div>
  </main>
    </>
  );
}
