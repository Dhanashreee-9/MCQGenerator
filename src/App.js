import React,{useState,useEffect,useRef} from 'react';
import FlashcardList from './Components/FlashcardList';
import axios from 'axios';
import './App.css';

function App() {
   const[flashcards,setFlashCards] =useState([]);
   const [categories, setCategories] = useState([]);
   const categoryEl=useRef()
   const amountEl=useRef()

   useEffect(() => {
    axios
      .get('https://opentdb.com/api_category.php')
      .then(res => {
        setCategories(res.data.trivia_categories)
      })
  }, [])

  function decodeString(str){
     const textArea = document.createElement('textArea');
     textArea.innerHTML = str;
     return textArea.value;
   }

  function handleSubmit(e){
     e.preventDefault()
     axios.get('https://opentdb.com/api.php?',{
       params:{
         amount: amountEl.current.value,
         category:categoryEl.current.value,
       }
     }
     )
     .then(resp=>{
   
         setFlashCards(resp.data.results.map((questionsItem,index)=>{
          const answer= decodeString(questionsItem.correct_answer);
          const  options=[...questionsItem.incorrect_answers.map(a=>decodeString(a))
            ,answer
          ]
          
          return{
            id: `${index} - ${Date.now()}`,
            question: decodeString(questionsItem.question),
            answer: answer,
            options: options.sort(()=> Math.random() - .5)
          }
           
         }))
     })
   }
  return (
    <React.Fragment>
      <form className="header" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" ref={categoryEl}>
          {categories.map(category => {
              return <option value={category.id} key={category.id}>{category.name}</option>
            })}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Number of questions</label>
          <input type="number" id="amount" min="1" step="1" defaultValue={10}
          ref={amountEl}/>
        </div>
        <div className="form-group">
        <button className="btn">generate</button>
        </div>
      </form>
      <div className="container">
      <FlashcardList flashcards={flashcards}/>
    </div>
    </React.Fragment>
    
  );
  }


export default App;
