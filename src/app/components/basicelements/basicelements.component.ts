import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServService } from 'app/service/serv.service';
import { FormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalComponent } from '../modal/modal.component';
import { getSystemErrorName } from 'util';
@Component({
  selector: 'app-basicelements',
  templateUrl: './basicelements.component.html',
  styleUrls: ['./basicelements.component.scss']
})
export class BasicelementsComponent {
  public modeselect = 'Domain';
  Profile_questionnaire_value: string;
  valeur: string;
  focus: boolean;
  toppings = new FormControl('');
    state_default: boolean = true;
  myForm: FormGroup;
  reponsesIncompletes: any;
  responce: any;
  selectedReponses: string[] = [];
  questionReponse: any;
  // Ajoutez une méthode pour mettre à jour la liste des réponses sélectionnées
  updateSelectedReponses(questionReponse: any) {
    // Vérifiez si la réponse a déjà été sélectionnée
    const index = this.selectedReponses.indexOf(questionReponse.selectedValue);
    // Si la réponse est sélectionnée, la supprimer de la liste
    if (index > -1) {
      this.selectedReponses.splice(index, 1);
    }
    // Sinon, l'ajouter à la liste
    else {
      this.selectedReponses.push(questionReponse.selectedValue);
    }
  }
  Envoyer(): void {
    console.log(this.listeQuestionnaire);
    this.reponsesIncompletes = false;
    for (let questionReponse of this.listeQuestionnaire.questionsReponses) {
      if (!questionReponse.selectedValue) {
        this.reponsesIncompletes = true;
        break;
      }
    }
    function flattenTable(table) {
      return table.reduce((flattenedTable, row) => {
        if (row.hasOwnProperty('selectedValue')) {
          if (Array.isArray(row.selectedValue)) {
            return [...flattenedTable, ...row.selectedValue];
          } else {
            return [...flattenedTable, row.selectedValue];
          }
        }

        if (row.hasOwnProperty('textValue')) {
          return [...flattenedTable, row.textValue];
        }
        return flattenedTable;
      }, []);
    }
    console.log(this.idClient);
    console.log(this.questionnaire);
    this.responce = {
      Contact_No: this.idClient,
      Profile_Questionnaire_Code: this.questionnaire,
      idQuestionnaire: this.idQuestionnaire,
      Profile_Questionnaire_Value: "",

      Line_No: undefined
    }
    console.log('les valeurs selectionnée :' + this.selectedReponses);
    const selectedValues = [];
    // Iterate over the questions and push the selected values to the array
    for (const questionReponse of this.listeQuestionnaire.questionsReponses) {

      if (!questionReponse.question.Champs_libre && questionReponse.selectedValue) {
        // Pour les autres types de questions, ajouter la valeur sélectionnée à selectedValues
        selectedValues.push({
          selectedValue: questionReponse.selectedValue
        });
      }
    }
    console.log('veu' + this.valeur);
    for (const questionReponse of this.listeQuestionnaire.questionsReponses) {
      // selectedValues.push(questionReponse.selectedValue);
      if (questionReponse.question.Champs_libre) {
        // Si c'est une question "champs libre" avec une valeur de champ texte&& questionReponse.selectedValue
        console.log(questionReponse.question);
        console.log('ok ok ok ' + questionReponse.selectedValue);
        //this.responce.Line_No = questionReponse.selectedValue;
        console.log('tres inmpor ' + questionReponse.reponses[0].Line_No);
        this.responce.Line_No = questionReponse.reponses[0].Line_No;
        this.responce.Profile_Questionnaire_Value = questionReponse.textValue;
        this.service.PostResponce(this.responce).toPromise();
        this.responce.Profile_Questionnaire_Value = '';
      } else if (!questionReponse.question.Champs_libre && questionReponse.selectedValue) {

      }
    }
    console.log(selectedValues);
    flattenTable(selectedValues);
    console.log(selectedValues + 'Flaten');
    var flattenedTable = flattenTable(selectedValues);
    console.log(flattenedTable);
    const promises = flattenedTable.map((value, index) => {
      // Affect the value of each element to Line_No
      this.responce.Line_No = value;
      // Perform necessary operations with this.responce here (e.g., save the data, etc.)
      return this.service.PostResponce(this.responce).toPromise();
    });
    Promise.all(promises)
      .then(results => {
        console.log('All operations completed successfully');
        // Display a success message to the user

        // alert('Success! All operations completed successfully');
        this.showModal();
        this.isCompleted = true;

      })
      .catch(error => {
        console.log('An error occurred:', error);
      });


    console.log('hethi hiya ' + this.surveyHistory);

    this.concurrencyToken = this.surveyHistory['@odata.etag'];
    // function getCurrentDate(): string {
    //   const today = new Date();
    //   const year = today.getFullYear();
    //   const month = String(today.getMonth() + 1).padStart(2, '0');
    //   const day = String(today.getDate()).padStart(2, '0');

    //   return `${year}-${month}-${day}`;
    // }
    function getCurrentDate(): string {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const hours = String(today.getHours()).padStart(2, '0');
      const minutes = String(today.getMinutes()).padStart(2, '0');
      const seconds = String(today.getSeconds()).padStart(2, '0');
      const milliseconds = String(today.getMilliseconds()).padStart(3, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    }


    const formattedDate = getCurrentDate();
    console.log(formattedDate);
    console.log(formattedDate);
    this.surveyHistory.AnswerDate = formattedDate;
    console.log(this.idQuestionnaire, this.surveyHistory, this.concurrencyToken);
    console.log(this.surveyHistory);
    this.service.UpdateSurveyHistory(this.idQuestionnaire, this.surveyHistory, this.concurrencyToken).subscribe(
      () => {
        console.log("Update successful");
        // Display success message

      },
      (error) => {
        console.log("Update failed:", error);
        // Display error message
        ////this.toastr.error("Error updating element", "Error", { positionClass: 'toast-top-center' });
      }
    );
  }
  constructor(private route: ActivatedRoute, public service: ServService, private formBuilder: FormBuilder, private modalService: NgbModal) { }
  showModal() {
    const modalRef = this.modalService.open(NgbdModalComponent);
    modalRef.componentInstance.title = 'Success!';
    modalRef.componentInstance.message = 'All operations completed successfully';
  }
  ContactInfo: any;
  idClient: any;
  questionnaire: any;
  dataSource: any;
  listeQuestionnaire: any;
  idQuestionnaire: any;
  surveyHistory: any;
  newSurveyHistory: any;
  concurrencyToken: any;
  parameters: any;
  titre1: any;
  titre2: any;
  url_logo: any;
  isCompleted: boolean = false;
  getSelectedReponses(): string[] {
    const selectedReponses: string[] = [];
    console.log(this.listeQuestionnaire);
    // Parcourez la liste des questions et réponses
    for (const questionReponse of this.listeQuestionnaire.questionsReponses) {
      // Vérifiez si une réponse a été sélectionnée
      if (questionReponse.selectedValue) {
        console.log(questionReponse.selectedValue);
        // Ajoutez la réponse sélectionnée à la liste
        selectedReponses.push(questionReponse.selectedValue.Description);
      }
    }
    console.log(selectedReponses);
    return selectedReponses;
  }

  ngOnInit() {
    this.service.getParameters().subscribe(res => {
      this.parameters = res.value[0];
      console.log(this.parameters);
      this.titre1 = this.parameters.DLT_Titre_1;
      this.titre2 = this.parameters.DLT_Titre_2;
      this.url_logo = this.parameters.DLT_Website_logo;
    })


    this.route.params.subscribe(params => {
      const id = params['id'];
      this.idClient = id;

    });
    this.route.params.subscribe(params => {
      const quest = params['quest'];
      this.questionnaire = quest;
    });
    this.route.params.subscribe(params => {
      const quesionnaireId = params['formulaire'];
      this.idQuestionnaire = quesionnaireId;
      console.log(this.idQuestionnaire + 'ines lahbib');
    });

    this.service.getSurveyHisory(this.idQuestionnaire).subscribe(res => {
      this.surveyHistory = res;
      console.log(this.surveyHistory);
    })
    this.newSurveyHistory = this.surveyHistory;

    this.service.getContact(this.idClient).subscribe(res => {
      this.ContactInfo = res.Name;
      console.log(this.ContactInfo);
    })
    this.service.getQuestionnaire(this.questionnaire).subscribe(res => {
      this.dataSource = res.value;
      interface Question {
        "@odata.etag": string;
        Profile_Questionnaire_Code: string;
        Line_No: number;
        Type: "Question";
        Description: string;
        Multiple_Answers: boolean;
      }
      interface Answer {
        "@odata.etag": string;
        Profile_Questionnaire_Code: string;
        Line_No: number;
        Type: "Answer";
        idQuestionnaire: number;
        Description: string;
        Multiple_Answers: boolean;
      }
      interface QuestionReponse {
        question: Question;
        reponses: Answer[];
        textValue?: string;
      }
      interface Resultat {
        questionsReponses: QuestionReponse[];
      }
      var questionsReponses: QuestionReponse[] = [];
      var currentQuestion: QuestionReponse | null = null;

      // Parcourir les éléments du JSON
      for (var i = 0; i < this.dataSource.length; i++) {

        var element: Question | Answer = this.dataSource[i];
        if (element.Type === "Question") {
          // Créer un nouvel objet de question
          currentQuestion = {
            question: element,
            reponses: []
          };
          // Ajouter la question à la liste des questions et réponses
          questionsReponses.push(currentQuestion);
        } else if (element.Type === "Answer" && currentQuestion !== null) {
          // Ajouter la réponse à la liste des réponses associées à la question actuelle
          currentQuestion.reponses.push(element);
        }
      }
      // Créer un objet JSON pour stocker les questions et les réponses associées
      var resultat: Resultat = {
        questionsReponses: questionsReponses
      };
      this.listeQuestionnaire = resultat;
      if (this.questionReponse.reponses.length > 0) {
        this.questionReponse.selectedValue = this.questionReponse.reponses[0].Line_No;
      }



    });

    function flattenTable(table) {
      var flattenedTable = [];

      // Recursive function to flatten nested tables
      function flattenNestedTable(nestedTable) {
        for (var i = 0; i < nestedTable.length; i++) {
          var row = nestedTable[i];

          // Check if the row contains a nested table
          if (Array.isArray(row)) {
            flattenNestedTable(row); // Recursively flatten the nested table
          } else {
            flattenedTable.push(row); // Add the row to the flattened table
          }
        }
      }
      flattenNestedTable(table);
      return flattenedTable;
    }
  };

  appeler() {
    interface Question {
      "@odata.etag": string;
      Profile_Questionnaire_Code: string;
      Line_No: number;
      Type: "Question";
      Description: string;
      Multiple_Answers: boolean;
    }
    interface Answer {
      "@odata.etag": string;
      Profile_Questionnaire_Code: string;
      Line_No: number;
      Type: "Answer";
      idQuestionnaire: number;
      Description: string;
      Multiple_Answers: boolean;
    }
    interface QuestionReponse {
      question: Question;
      reponses: Answer[];
      textValue?: string;

    }
    interface Resultat {
      questionsReponses: QuestionReponse[];
    }
    var questionsReponses: QuestionReponse[] = [];
    var currentQuestion: QuestionReponse | null = null;

    // Parcourir les éléments du JSON
    for (var i = 0; i < this.dataSource.value.length; i++) {
      var element: Question | Answer = this.dataSource.value[i];
      if (element.Type === "Question") {
        // Créer un nouvel objet de question
        currentQuestion = {
          question: element,
          reponses: []
        };
        // Ajouter la question à la liste des questions et réponses
        questionsReponses.push(currentQuestion);
      } else if (element.Type === "Answer" && currentQuestion !== null) {
        // Ajouter la réponse à la liste des réponses associées à la question actuelle
        currentQuestion.reponses.push(element);
      }
    }
    // Créer un objet JSON pour stocker les questions et les réponses associées
    var resultat: Resultat = {
      questionsReponses: questionsReponses
    };
    console.log('ok');
    console.log(resultat);

  };

}








