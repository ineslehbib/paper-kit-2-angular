import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServService } from 'app/service/serv.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
    selector: 'app-nucleoicons',
    templateUrl: './nucleoicons.component.html',
    styleUrls: ['./nucleoicons.component.scss'],
})
export class NucleoiconsComponent implements OnInit, OnDestroy {

    @ViewChild('pdf', { static: false }) pdf: ElementRef;
    parameters: any;
    url_logo: any;
    quoteLine: any;
    quote: any;
    telephone: any;
    email: any;
    videoSrc: any;
    id: any;
    errorMessage: string | null = null;
    statusAcceptation: any;
    statusRefus: any;
    confirmed: boolean = false;
    refused: boolean = false;
    doc: any;
    private subscriptions: Subscription = new Subscription();
    constructor(
        private route: ActivatedRoute,
        public service: ServService,
        private domSanitizer: DomSanitizer
    ) { }

    ngOnInit() {

        this.route.params.subscribe((params) => {
            const encodedId = params['identifiant'];
            this.id = this.decodeBase64(encodedId);
            this.loadData();
        });

    }
    decodeBase64(encodedString: string): string {
        return atob(encodedString);
    }
    loadData() {
        // Fetch parameters
        this.service.getParameters().subscribe((res) => {
            this.parameters = res.value[0];
            this.statusAcceptation = this.parameters.Document_status_accepted;
            this.statusRefus = this.parameters.Document_status_rejected;
            this.url_logo = this.parameters.DLT_Website_logo;
            this.updateButtonStates();
        });

        // Fetch quote information
        this.service.getQuoteInformation(this.id).subscribe((res) => {
            this.quote = res.value[0];
            this.quoteLine = res.value;
            const contactNo = this.quote.Bill_to_Contact_No_;

            // Fetch contact details
            this.service.getContact(contactNo).subscribe((res) => {
                this.telephone = res.Phone_No;
                this.email = res.E_Mail;
            });

            // Update button visibility based on document status

        });

        // Fetch video data
        this.service.getVideo({ inputJson: JSON.stringify({ documentId: this.id }) }).subscribe({
            next: (response) => {
                const base64Data = response.value;
                if (base64Data) { // Check if base64Data is not empty
                    this.videoSrc = this.domSanitizer.bypassSecurityTrustUrl(
                        this.createVideoSrc(base64Data)
                    );
                } else {
                    this.videoSrc = null; // Set videoSrc to null if base64Data is empty
                }
            },
            error: (error) => {
                this.errorMessage = 'Error fetching video data: ' + error.message;
            },
        });
    }

    updateButtonStates() {
        if (this.quote) {
            this.confirmed = this.quote.Document_Status === this.statusAcceptation;
            this.refused = this.quote.Document_Status === this.statusRefus;
        }
    }

    confirm() {
        this.service.confirm('Confirmation', 'Êtes-vous sûr de vouloir confirmer le devis ?').then((confirmed) => {
            if (confirmed) {
                const inputJson = {
                    inputJson: JSON.stringify({ documentId: this.id, status: this.statusAcceptation }),
                };
                this.service.ChangeStatus(inputJson).subscribe({
                    next: (response) => {
                        this.confirmed = true;
                        this.refused = false;
                    },
                    error: (error) => {
                        this.errorMessage = 'Error changing document status: ' + error.message;
                    },
                });
            }
        });
    }

    reject() {
        this.service.confirm('Rejet', 'Êtes-vous sûr de vouloir refuser le devis ?').then((confirmed) => {
            if (confirmed) {
                const inputJson = {
                    inputJson: JSON.stringify({ documentId: this.id, status: this.statusRefus }),
                };
                this.service.ChangeStatus(inputJson).subscribe({
                    next: (response) => {
                        this.refused = true;
                        this.confirmed = false;
                    },
                    error: (error) => {
                        this.errorMessage = 'Error changing document status: ' + error.message;
                    },
                });
            }
        });
    }
    // Imprimerpdf() {
    //     const doc = new jsPDF();

    //     const specialElementHandlers = {
    //         '#editor': function (element, renderer) {
    //             return true;
    //         }
    //     };

    //     const pdfTable = this.pdf.nativeElement;

    //     doc.html(pdfTable.innerHTML);

    //     doc.save('devis.pdf');


    // }
    createVideoSrc(base64Data: string): string {
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'video/mp4' });
        return URL.createObjectURL(blob);
    }

    ngOnDestroy() {
        // Unsubscribe from all subscriptions
        this.subscriptions.unsubscribe();
    }
    Imprimerpdf() {
        // Ensure you have access to the jsPDF from the UMD package
        // const { jsPDF } = window.jspdf;

        // Create a new jsPDF instance

        // Create a new jsPDF instance
        const doc = new jsPDF('p', 'mm', 'a4'); // Initialize PDF with A4 size

        // Reference to the element to convert to PDF
        const pdfTable = document.getElementById('pdfTable');

        if (!pdfTable) {
            console.error('Element with id "pdfTable" not found.');
            return;
        }

        // Use html2canvas to convert the HTML element to a canvas
        html2canvas(pdfTable, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            // Add the image to the PDF document
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // If the content exceeds one page, add new pages
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // Get the current date and time
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
            const day = now.getDate().toString().padStart(2, '0');
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');

            // Format the date and time for the filename
            const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
            const filename = `devis_${timestamp}.pdf`;

            // Save the PDF with the filename including date and time
            doc.save(filename);

        }).catch(err => {
            console.error('Error generating PDF:', err);
        });
    }

}
