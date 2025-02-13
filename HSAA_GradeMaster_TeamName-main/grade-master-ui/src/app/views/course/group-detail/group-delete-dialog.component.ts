import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * Komponente für den Bestätigungsdialog zum Löschen einer Gruppe.
 * Dieser Dialog fragt den Benutzer, ob er sicher ist, eine Gruppe zu löschen.
 */
@Component({
  selector: 'app-group-delete-dialog',
  templateUrl: './group-delete-dialog.component.html',
  standalone: true,
  styleUrls: ['./group-delete-dialog.component.scss']
})
export class GroupDeleteDialogComponent {

  /**
   * Erstellt eine Instanz des Dialogs zum Bestätigen des Gruppenlöschens.
   *
   * @param dialogRef - Referenz des Dialogs, um ihn zu schließen.
   * @param data - Daten, die an den Dialog übergeben wurden, insbesondere der Gruppenname.
   */
  constructor(
    public dialogRef: MatDialogRef<GroupDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { groupName: string }
  ) {}

  /**
   * Schließt den Dialog mit einer "Abbrechen"-Antwort (false).
   */
  onCancel(): void {
    this.dialogRef.close(false); // Schließt den Dialog mit "Abbrechen"
  }

  /**
   * Schließt den Dialog mit einer "Bestätigen"-Antwort (true).
   */
  onConfirm(): void {
    this.dialogRef.close(true); // Schließt den Dialog mit "OK"
  }
}
