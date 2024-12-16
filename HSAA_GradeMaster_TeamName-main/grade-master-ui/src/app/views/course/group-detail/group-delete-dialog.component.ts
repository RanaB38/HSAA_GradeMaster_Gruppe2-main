import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-group-delete-dialog',
  templateUrl: './group-delete-dialog.component.html',
  standalone: true,
  styleUrls: ['./group-delete-dialog.component.scss']
})
export class GroupDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GroupDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { groupName: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false); // Schließt den Dialog mit "Abbrechen"
  }

  onConfirm(): void {
    this.dialogRef.close(true); // Schließt den Dialog mit "OK"
  }
}
