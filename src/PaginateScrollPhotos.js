import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
export default function PaginateScrollPhotos() {
  const [photos, setPhotos] = useState([]) // по умолчанию масив
const [currentPage, setCurrentPage] = useState(1)
const [fetching, setFetching] = useState(true)
const [totalCount, setTotalCount] = useState(0)
useEffect(()=> {
  if(fetching) {
         // Номер страницы и количество отображаемых элементов будем менять прямо в строке URL - здесь 10 элементов на странице
axios.get(`https://jsonplaceholder.typicode.com/photos?_limit=10&_page=${currentPage}`)
.then(response => {
 // console.log(response.data); // заголовки получим весь массив  - если просто response - то заголовки
 //чтобы не затирать старые данные - разворачиваем массив и добавляем к старым новые фото
  setPhotos([...photos, ...response.data])  
  setCurrentPage(prev => prev + 1)
console.log(response.headers['x-total-count']); //  
setTotalCount(response.headers['x-total-count']) //  
}).finally( ()=> {
  // в конце загрузки первых 10 страниц надо изменить state на false чтобы остановить ее иначе будет бесконечно загружать т.к. UseEffect будет срабатывать
  setFetching(false) //  
})
   }
}, [fetching, photos, currentPage]) // ESLint ругается на аргументы - убрать можно и также работает.будет зависеть от состояния fetching - и при true будет запускать запрос
useEffect(()=> {
document.addEventListener('scroll', scrollHandler);  
return function () {  // удаляем слушатель после работы
  document.removeEventListener('scroll', scrollHandler);  
}
}, [totalCount] )  
// определяем высоту страницы, текущее положение скрола от верха, и высота видимой части контента
const scrollHandler = (e)=> {
  if(e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100 && photos.length < totalCount ) 
  {
   // console.log(photos.length); // 1000
    //console.log(totalCount); // 5000
    setFetching(true)
  }
}
  return (
    <>
  {
  photos.map((item, i)=> { 
   return ( 
    <div className='photos' key={item.id}> 
    <div className="title">{item.id}. {item.title}</div>
    <img src={item.thumbnailUrl} alt="#" />
     </div>
    )})  
  } 
    </>
  );
}
