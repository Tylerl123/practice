let questions = [];

function f1() {
  var quiz1 = document.getElementById("quiz1");
  var quiz2 = document.getElementById("quiz2");

  if(quiz1.checked==true)
    fetch("quiz1.json")
      .then( res => {
        console.log(res);
        return res.json();
        }).then(loaded_questions => {
          console.log(loaded_questions);
          questions = loaded_questions;
        })
        .catch(err=>{
          console.error(err);
        });
  else if(quiz2.checked==true)
    fetch("quiz2.json")
      .then( res => {
        console.log(res);
        return res.json();
        }).then(loaded_questions => {
          console.log(loaded_questions);
          questions = loaded_questions;
        })
        .catch(err=>{
          console.error(err);
        });
  else
  alert("Please select a quiz.");
  return false;
}

  // appState, keep information about the State of the application.
  const appState = {
      current_view : "#intro_view",
      current_question : -1,
      current_model : {},
      current_score: 0,
  }
  
  //
  // start_app: begin the applications.
  //
  
  document.addEventListener('DOMContentLoaded', () => {
    // Set the state
    appState.current_view =  "#intro_view";
    appState.current_model = {
      action : "Start"
    }
    update_view(appState);
  
    //
    // EventDelegation - handle all events of the widget
    //
  
    document.querySelector("#widget_view").onclick = (e) => {
        handle_widget_event(e)
    }
  });
  
  
  
  function handle_widget_event(e) {
  
    if (appState.current_view == "#intro_view"){
      if (e.target.dataset.action == "Start") {
  
          // Update State (current model + state variables)
          appState.current_question = 0
          appState.current_model = questions[appState.current_question];
          // process the appState, based on question type update appState.current_view
          setQuestionView(appState);
         
          // Now that the state is updated, update the view.
  
          update_view(appState);
      }
    }

    if (appState.current_view == "#question_view_multiple_choice") {
  
      if (e.target.dataset.action == "answer") {
        let choices = document.getElementsByName("choice");
        let user_response;
  
        for (let i = 0; i < choices.length; i++) {
          if (choices[i].checked) {
            user_response = choices[i].value;
          }
        }
  
        isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
        if(isCorrect){
          appState.total_correct++
        }
       
         appState.current_question =   appState.current_question + 1;
         appState.current_model = questions[appState.current_question];


         feedbackView(isCorrect);
         setQuestionView(appState);
       
         update_view(appState);
  
       }
     }
  
  
    // Handle the answer event.
    if (appState.current_view == "#question_view_true_false") {
  
      if (e.target.dataset.action == "answer") {
         // Controller - implement logic.
         isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
       
         // Update the state.
         appState.current_question =   appState.current_question + 1;
         appState.current_model = questions[appState.current_question];
         feedbackView(isCorrect);
         setQuestionView(appState);
       
         // Update the view.  
         update_view(appState);
  
       }
     }
  
     // Handle answer event for  text questions.
     if (appState.current_view == "#question_view_text_input") {
         if (e.target.dataset.action == "submit") {
       
             user_response = document.querySelector(`#${appState.current_model.answerFieldId}`).value;
             isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
             updateQuestion(appState)
             //appState.current_question =   appState.current_question + 1;
             //appState.current_model = questions[appState.current_question];
             feedbackView(isCorrect);
             setQuestionView(appState);
             update_view(appState);
         }
      }
  
      
       // Handle the answer event.
    if (appState.current_view == "#question_view_multiple_correct") {
  
      if (e.target.dataset.action == "submit") {
       var checkboxes = document.getElementsByName("checkbox");
       var checked = [];
       for (var i = 0; i < checkboxes.length; i++) {
         if (checkboxes[i].checked) {
           checked.push(checkboxes[i].value);
         }
       }
      // Controller - implement logic.
      isCorrect = check_user_response(checked, appState.current_model);
      if (isCorrect) {
       appState.current_score++;
     }

      // Update the state.
      appState.current_question =   appState.current_question + 1;
      appState.current_model = questions[appState.current_question];
      feedbackView(isCorrect);
      setQuestionView(appState);
    
      // Update the view.  
      update_view(appState);

    }
  }
    // Handle answer event for  text questions.
    if (appState.current_view == "#question_view_image_labelling") {
     if (e.target.dataset.action == "submit") {
   
         user_response = document.querySelector(`#${appState.current_model.answerFieldId}`).value;
         isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
         updateQuestion(appState)
         //appState.current_question =   appState.current_question + 1;
         //appState.current_model = questions[appState.current_question];
         feedbackView(isCorrect);
         setQuestionView(appState);
         update_view(appState);
     }
  }

      // Handle answer event for  text questions.
      if (appState.current_view == "#end_view") {
      let final_Score = ((appState.current_score/20) * 100);
        console.log("Final Score: " + final_Score);
        if (final_Score >= 80) {
          document.getElementById("finalMessage").innerHTML = "Final Score: " + final_Score + "%<br>Congratulations, " + name + " - you passed the quiz!";
        }
        else {
          document.getElementById("finalMessage").innerHTML = "Final Score: " + final_Score + "%<br>Sorry, " + name + " - you failed the quiz.";
        }
          if (e.target.dataset.action == "start_again") {
            appState.current_view =  "#intro_view";
            appState.current_model = {
              action : "start_again"
            }
            update_view(appState);
  
          }
        }


  
   } // end of handle_widget_event
  
  
  function check_user_response(user_answer, model) {
    if (appState.current_model.questionType == "multiple_correct" || appState.current_model.questionType == "multi_text_input") {
      if (JSON.stringify(user_answer) === JSON.stringify(model.correctAnswer)) {
        return true;
      }
    }
    else if (user_answer == model.correctAnswer) {
        return true;
      }
    return false;
  }

  function feedbackView(isCorrect) {
    if (isCorrect == true) {
      appState.current_view = "#feedback_view_correct";
    } else {
      appState.current_view = "#feedback_view_incorrect";
    }
  }
  
  function updateQuestion(appState) {
      if (appState.current_question < questions.length-1) {
        appState.current_question =   appState.current_question + 1;
        appState.current_model = questions[appState.current_question];
      }
      else {
        appState.current_question = -2;
        appState.current_model = {};
      }
  }
  
  function setQuestionView(appState) {
    if (appState.current_question == -2) {
      appState.current_view  = "#end_view";
      return
    }
    if (appState.current_model.questionType == "multiple_choice"){
      appState.current_view = "#question_view_multiple_choice";
    }
    else if (appState.current_model.questionType == "true_false") {
      appState.current_view = "#question_view_true_false";
    }
    else if (appState.current_model.questionType == "text_input") {
      appState.current_view = "#question_view_text_input";
    }
    else if (appState.current_model.questionType == "multiple_correct") {
      appState.current_view = "#question_view_multiple_correct";
    }
    else if (appState.current_model.questionType == "question_view_image_labelling") {
      appState.current_view = "#question_view_text_input";
    }
  }
  
  function update_view(appState) {
  
    const html_element = render_widget(appState.current_model, appState.current_view)
    document.querySelector("#widget_view").innerHTML = html_element;
  }
  //
  
  const render_widget = (model,view) => {
    // Get the template HTML
    template_source = document.querySelector(view).innerHTML
    // Handlebars compiles the above source into a template
    var template = Handlebars.compile(template_source);
  
    // apply the model to the template.
    var html_widget_element = template({...model,...appState})
  
    return html_widget_element
  }
