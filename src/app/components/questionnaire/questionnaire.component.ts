import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServService } from 'app/service/serv.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent {
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
    console.log(this.idClient);
    console.log(this.questionnaire);
    console.log(this.selectedReponses);
    console.log(this.idQuestionnaire + 'ines');
    const selectedValues = [];
    // Iterate over the questions and push the selected values to the array
    for (const questionReponse of this.listeQuestionnaire.questionsReponses) {
      selectedValues.push(questionReponse.selectedValue);
    }
    console.log(selectedValues);

    this.responce = {
      Contact_No: this.idClient,
      Profile_Questionnaire_Code: this.questionnaire,
      idQuestionnaire: this.idQuestionnaire,
      Line_No: undefined
    }
    selectedValues.forEach((value, index) => {
      // Affecter la valeur de chaque élément à Line_No
      this.responce.Line_No = value;

      // Effectuer les opérations nécessaires avec this.responce ici (par exemple, enregistrer les données, etc.)
      this.service.PostResponce(this.responce).subscribe(result => {
        console.log(result)
      });
      console.log(`Valeur ${index + 1} : ${value}`);
    });
  }
  constructor(private route: ActivatedRoute, public service: ServService) { }
  idClient: any;
  questionnaire: any;
  dataSource: any;
  listeQuestionnaire: any;
  formulaire: any;
  idQuestionnaire: any;
  getSelectedReponses(): string[] {
    const selectedReponses: string[] = [];
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
    }
    interface Resultat {
      questionsReponses: QuestionReponse[];
    }

    var questionsReponses: QuestionReponse[] = [];
    var currentQuestion: QuestionReponse | null = null;
    this.route.params.subscribe(params => {
      const id = params['id'];

      this.idClient = id;
      // console.log(idQuestionnaire + 'ines');
      // this.idQuestionnaire = idQuestionnaire;
      this.service.getQuestionnaire(this.questionnaire).subscribe(res => {
        this.dataSource = res.value;

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
      });
    });
    this.route.params.subscribe(params => {
      const quest = params['quest'];
      this.questionnaire = quest;
    });


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
        idQuestionnaire: number;
        Type: "Answer";
        Description: string;
        Multiple_Answers: boolean;
      }
      interface QuestionReponse {
        question: Question;
        reponses: Answer[];
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
    });
  };
  appeler() {
    console.log(this.idQuestionnaire);
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
