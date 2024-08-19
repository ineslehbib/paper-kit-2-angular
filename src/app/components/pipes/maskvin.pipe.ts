import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskvin'
})
export class MaskvinPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value || typeof value !== 'string' || value.length <= 5) {
      // Retourner une chaîne vide si la valeur n'est pas valide ou trop courte
      return '';
    }

    // Masquer les 5 derniers chiffres
    const visiblePart = value.slice(0, -5); // Partie visible du VIN
    const maskedPart = '*'.repeat(5); // Partie masquée

    return `${visiblePart}${maskedPart}`;
  }

}
