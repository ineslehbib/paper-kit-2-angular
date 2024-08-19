import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskserie'
})
export class MaskseriePipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value || typeof value !== 'string' || value.length <= 4) {
      // Retourner une chaîne vide si la valeur n'est pas valide ou trop courte
      return '';
    }

    // Masquer les 5 derniers chiffres
    const visiblePart = value.slice(0, -4); // Partie visible du VIN
    const maskedPart = '*'.repeat(4); // Partie masquée

    return `${visiblePart}${maskedPart}`;
  }

}
