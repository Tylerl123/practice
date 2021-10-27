const app_stage = {
    current_stage : "#init_view",
    quiz_choice : "",
    current_question : -1,
    current_model : {},
    current_correct: 0,
    current_incorrect: 0, 
    questions_left: 20
}

document.addEventListener('DOMContentLoaded', ()  => {
    app_stage.current_stage = "#init_view"
    app_stage.current_model = {
        action : "start_app"
    }
    update_view(app_stage)

    document.querySelector("#app_widget").onclick = (e) => {
        handle_widget_events(e)
    }

    console.log(app_stage.current_model)
});



function handle_widget_events(e) {


   
    console.log(app_stage.quiz_choice)

    if(app_stage.current_stage == "#init_view") {


       
        if (e.target.dataset.action == "start_app") {
            
            const params = new URLSearchParams(window.location.search)

            if (params.has('quiz_choice')) {
                quiz_choice = params.get('quiz_choice')
            }  
          
            app_stage.current_question = 0;
            app_stage.current_model = quiz_choice[app_stage.current_question];

            setQuestionView(app_stage);

            update_view(app_stage);
           
        }       
    }

    if(app_stage.current_stage == "#question_multChoice_view") {
        if(e.target.dataset.action == "answer") {
            isCorrect = check_user_response(e.target.dataset.answer, app_stage.current_model)

            if (isCorrect == true) {
                app_stage.current_correct++;
            } 
            else if (isCorrect == false) {
                app_stage.current_incorrect++;
            }

            app_stage.current_question++;
            app_stage.questions_left--;
            
            app_stage.current_model = quiz_choice[app_stage.current_question]
            setQuestionView(app_stage)

            update_view(app_stage)
        }
    }

    if(app_stage.current_stage == "#question_textInput_view") {

    }

    if(app_stage.current_stage == "#question_trueFalse_view") {
        if(e.target.dataset.action == "answer") {
            isCorrect = check_user_response(e.target.dataset.answer, app_stage.current_model)

            if (isCorrect == true) {
                app_stage.current_correct++;
            } 
            else if (isCorrect == false) {
                app_stage.current_incorrect++;
            }

            app_stage.current_question++;
            app_stage.questions_left--;
            
            app_stage.current_model = quiz_choice[app_stage.current_question]
            setQuestionView(app_stage)

            update_view(app_stage)
        }

    }

    if(app_stage.current_stage == "#question_imageAnalysis_view") {
        if(e.target.dataset.action == "answer") {
            isCorrect = check_user_response(e.target.dataset.answer, app_stage.current_model)

            if (isCorrect == true) {
                app_stage.current_correct++;
            } 
            else if (isCorrect == false) {
                app_stage.current_incorrect++;
            }

            app_stage.current_question++;
            app_stage.questions_left--;
            
            app_stage.current_model = quiz_choice[app_stage.current_question]
            setQuestionView(app_stage)

            update_view(app_stage)
        }
    }

    if(app_stage.current_stage == "#question_selectChoice_view") {

    }

}

function check_user_response(user_answer, model) {
    if (user_answer == model.correct_answer) {
        return true;
    }
    return false;
}

function updateQuestion(app_stage) {
    if(app_stage.current_question < quiz_choice.length - 1) {
        app_stage.current_question = app_stage.current_question + 1
        app_stage.current_model = quiz_choice[app_stage.current_question]

    }
    else { 
        app_stage.current_question = -2;
        app_stage.current_model = {}
    }
}

function setQuestionView(app_stage) {
    if (app_stage.current_question == -2) {
        app_stage.current_stage = "#app_end_view"
        return
    }

    const params = new URLSearchParams(window.location.search)

    if (params.has('quiz_choice')) {
        quiz_choice = params.get('quiz_choice')
    }    
    

    if (app_stage.current_model.quiz_choice.question_type == "mult_choice_text") {
        app_stage.current_stage = "#question_multChoice_view"
    }
    else if (app_stage.current_model.quiz_choice.question_type == "question_input_text") {
        app_stage.current_stage = "#question_textInput_view" 
    }
    else if (app_stage.current_model.quiz_choice.question_type == "question_trueFalse") {
        app_stage.current_stage = "#question_trueFalse_view"
    }
    else if (app_stage.current_model.quiz_choice.question_type == "image_analysis") {
        app_stage.current_stage == "#question_imageAnalysis_view"
    } 
    else if (app_stage.current_model.quiz_choice.question_type == "mult_select_choice") {
        app_stage.current_stage == "#question_selectChoice_view"
    }
}


async function update_view (app_stage) {
    const data = await fetch("https://my-json-server.typicode.com/Elson0129/CUS1172_Assignment03/db")
    const model = await data.json()
    const html_element = render_widget(app_stage.current_model, app_stage.current_stage)
    document.querySelector("#app_widget").innerHTML = html_element;
}

const render_widget = (model, view) => {
    template_source = document.querySelector(view).innerHTML

    var template = Handlebars.compile(template_source);

    var html_widget_element = template({...model,...app_stage})
    return html_widget_element
}
