import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationComponent } from '../notification/notification.component';
import { NavigationService } from '../../services/navigation.service';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationComponent, LoadingIndicatorComponent, FormsModule, ReactiveFormsModule]
})
export class LayoutComponent {
  reportForm: FormGroup;
  reportTypes = [
    'skillDistribution',
    'courseCompletion',
    'departmentPerformance',
    'learningPathProgress',
    'skillGapAnalysis'
  ];
  reportData: any;

  constructor(
    public navigationService: NavigationService,
    private fb: FormBuilder,
    private reportsService: ReportsService
  ) {
    this.reportForm = this.fb.group({
      reportType: ['', Validators.required],
      dateRange: ['', Validators.required]
    });
  }

  generateReport() {
    if (this.reportForm.valid) {
      const reportType = this.reportForm.get('reportType')?.value;
      this.reportsService.generateReport(reportType).subscribe(
        (data) => {
          this.reportData = data;
        },
        (error) => console.error('Error generating report:', error)
      );
    }
  }
}