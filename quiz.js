// File : 02_app_demo.js
//
//
// appState, keep information about the State of the application.
let totalSeconds = 0;
let userName = "";

const appState = {
    current_view : "#intro_view",
    current_question : -1,
  //  current_quiz: "",
    quiz_name:"",
    current_model : {},
    answers_right:0,
    answers_wrong:0,
    question_amount: 19,
}

async function get_Data(quiz_name, current_question){
  var api_url = 'https://my-json-server.typicode.com/rbakar18/QuizQuestions1/'
  var endpoint = `${api_url}/${quiz_name}/${current_question}`

  const data = await fetch(endpoint)
  var model = await data.json()

  appState.current_model = model;
  console.log(data)

  setQuestionView(appState);
  update_view(appState);

  document.getElementById("numcorrect").innerHTML = appState.answers_right + appState.answers_wrong;
  if (current_question == 0) {
    document.getElementById("numincorrect").innerHTML = 0;
  }
  else {
    document.getElementById("numincorrect").innerHTML = +(((appState.answers_right / (appState.answers_right + appState.answers_wrong)) * 100).toFixed(2));
  }
  return (data);
  }


//
// start_app: begin the applications.
//

document.addEventListener('DOMContentLoaded', () => {
  // Set the state
  appState.current_view = "#intro_view";
  appState.current_model = {
    action : "start_quiz",
    action1 : "start_quiz",

  }
  update_view(appState);

  //
  // EventDelegation - handle all events of the widget
  //

  document.querySelector("#widget_view").onclick = (e) => {
      handle_widget_event(e)
  }
});

let minutesLabel = "";
let secondsLabel = "";
let timer = 0;

function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}
/*
function setFeedbackView(answerCheck){
  if (answerCheck == true) {
    appState.current_view = "#answer_correct_feedback_view";
  }else{
    appState.current_view = "#answer_incorrect_feedback_view";
  }
}
function setExplanationView() {
  appState.current_view = "#explanation_view";
}
function displayExplanation(answerCheckFor) {
  if (!answerCheckFor) {
    new Promise(function (resolve, reject) {
      setTimeout(resolve, 1000);
    }).then(function () {
      if (!answerCheckFor) {
        setExplanationView();
        update_explanationView(appState);
      }
    });
  }
  if (answerCheckFor) {
    new Promise(function (resolve, reject) {
      setTimeout(resolve, 1000);
    }).then(function () {
      updateQuestion(appState);
      setQuestionView(appState);
      update_view(appState);
    });
  }
}
*/

function handle_widget_event(e) {

  if (appState.current_view == "#intro_view"){
    userName = document.getElementById("userName").value;
    if (userName == "") {
      userName = "User";
    }
    if (e.target.dataset.action == "start_quiz") {
      timer = setInterval(setTime, 1000);
      minutesLabel = document.getElementById("minutes");
      secondsLabel = document.getElementById("seconds");
      appState.current_question = 0;
      appState.quiz_name = document.querySelector('input[name="quiz_name"]:checked').value;
      var current_question_data = get_Data(appState.quiz_name, appState.current_question)
      console.log(appState)
    //  get_Data(appState.current_question + 1, appState.current_quiz);
    }
  }

  if (appState.current_view == "#question_view_multiple_choice"){
    if(e.target.dataset.action == "answer"){
      let choices = document.getElementsByName("choice");
      let user_response;

      for (let i = 0; i < choices.length; i++) {
        if (choices[i].checked) {
          user_response = choices[i].value;
        }
      }
      isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
      if (isCorrect) {
        appState.answers_right++;
      }
      else {
        appState.answers_wrong++;
      }

      console.log("Update question_view_multiple_choice")
      console.log(appState)

      updateQuestion(appState);
      setFeedbackView(isCorrect);
      update_view(appState);
      var current_question_data = get_Data(appState.quiz_name, appState.current_question)

  }
}
  if (appState.current_view == "#question_view_true_false") {

    if (e.target.dataset.action == "answer") {
      // Controller - implement logic.
      isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
      if (isCorrect) {
         appState.answers_right++;
       }
       else {
         appState.answers_wrong++;
       }
       console.log("Update question_view_true_false")
       console.log(appState)
      // Update the state.
    //  appState.current_question =   appState.current_question + 1;
    //  appState.current_model = questions[appState.current_question];
      updateQuestion(appState)
      setFeedbackView(isCorrect);
      // Update the view.
      update_view(appState);
      var current_question_data = get_Data(appState.quiz_name, appState.current_question)

    }
  }
  if (appState.current_view == "#question_view_text_input") {
      if (e.target.dataset.action == "submit") {

          user_response = document.querySelector(`#${appState.current_model.answerText}`).value;
          isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
          isCorrect = check_user_response(user_response, appState.current_model);

          if (isCorrect) {
            appState.answers_right++;
          }
          else {
            appState.answers_wrong++;
          }
          console.log("Update question_view_text_input")
          console.log(appState)
          updateQuestion(appState)
          //appState.current_question =   appState.current_question + 1;
          //appState.current_model = questions[appState.current_question];
          setFeedbackView(isCorrect);
          update_view(appState);
          var current_question_data = get_Data(appState.quiz_name, appState.current_question)

      }
   }

      //let selections = document.getElementsByName("choice");
      //let user_selection;
/*
      for(let i = 0; i < selections.length; i++){
        if(selections[i].checked){
          user_selection = selections[i].value;
        }
      }
      answerCheck = check_user_response(user_response, appState.current_model);
      if (isCorrect){
        appState.answers_right++;
      }else{
        appState.answers_wrong++;
      }
      setFeedbackView(answerCheck);
      update_feedbackView(appState);
      displayExplanation(answerCheck);
*/
  if (appState.current_view == "#end_view"){
    clearInterval(timer);

    let finalScore = +(((appState.answers_right / (appState.answers_wrong + appState.answers_right)) * 100).toFixed(2));
    if (finalScore >= 65) {
      document.getElementById("end_message").innerHTML = "Final Score: " + finalScore + "%<br>Rejoice " + userName + ", you passed!" + "<br>To Restart Quiz click on Quiz App";
    }
    else {
      document.getElementById("end_message").innerHTML = "Final Score: " + finalScore + "%<br>Alas " + userName + ", failure." + " But it is not over. <br>To Restart Quiz click on Quiz App";
    }
    if (e.target.dataset.action == "{{this.action}}") {
      appState.current_view = "#intro_view";
      appState.current_question = -1,
        appState.quiz_name = "",
        appState.current_model = {},
        appState.answers_right = 0,
        appState.answers_wrong = 0
        appState.current_model = {
             action: "start_app"
        }
      update_view(appState);
    }
  }

}
/*
    let cumulativeScore = +((appState.answers_right / (appState.answers_right + appState.answers_wrong))*100);
    if (cumulativeScore >= 80){
      document.getElementById("end_message").innerHTML = "Results: " + cumulativeScore + " Epic! You passed, pop some champagne :)."
  }else{
    document.getElementById("end_message").innerHTML = "Results: " + cumulativeScore + " Bad Ending. You failed :(. Try again though."
    }
*/

// Handle the answer event.

/*
   // Handle answer event for  text questions.
    // Handle answer event for  text questions.
    if (appState.current_view == "#end_view") {
        if (e.target.dataset.action == "start_again") {
          appState.current_view =  "#intro_view";
          appState.current_model = {
            action : "start_app"
          }
          update_view(appState);
        }
      }
 } // end of hadnle_widget_event
*/

function check_user_response(user_answer, model) {
  if (JSON.stringify(user_answer) === JSON.stringify(model.correctAnswer)) {
      return true;
  }
  else {
    if (user_answer == model.correctAnswer) {
      return true;
    }
  }
  return false;
}

function updateQuestion(appState) {
  if (appState.current_question < appState.question_amount) {
    appState.current_question = appState.current_question + 1;
  //  get_Data(appState.current_question + 1, appState.current_quiz);
  }
  else {
    appState.current_question = -2;
    appState.current_model = {};
  }
}

function setQuestionView(appState){
  console.log(appState.current_model.questionType)
if (appState.current_question == -2) {
  appState.current_view  = "#end_view";
  return
}
console.log(appState.current_model.questionType)
if (appState.current_model.questionType == "multiple_choice")
  appState.current_view = "#question_view_multiple_choice";
else if (appState.current_model.questionType == "true_false") {
  appState.current_view = "#question_view_true_false";
}
else if (appState.current_model.questionType == "text_input"){
    appState.current_view = "#question_view_text_input";
  }

}

  function setFeedbackView(isCorrect) {
    if (isCorrect == true) {
      appState.current_view = "#answer_correct_feedback_view";
    } else {
      appState.current_view = "#answer_incorrect_feedback_view";
    }
    return false;
  }

function update_view(appState) {
  const html_element = render_widget(appState.current_model, appState.current_view)
  document.querySelector("#widget_view").innerHTML = html_element;
  }
/*
function update_feedbackView(appState){
  const html_element = render_widget(appState.current_model, appState.current_view)
  document.querySelector("#widget_view").innerHTML = html_element;
}
*/
const render_widget = (model, view) => {
  // Get the template HTML
  template_source = document.querySelector(view).innerHTML
  // Handlebars compiles the above source into a template
  var template = Handlebars.compile(template_source);
  // apply the model to the template.
  var html_widget_element = template({ ...model, ...appState })

  return html_widget_element
}
