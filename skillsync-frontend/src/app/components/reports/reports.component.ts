import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsService } from '../../services/reports.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ReportsComponent implements OnInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  
  reportTypes = [
    'skillDistribution',
    'courseCompletion',
    'departmentPerformance',
    'learningPathProgress',
    'skillGapAnalysis'
  ];
  selectedReportType: string = '';
  reportData: any;
  isLoading: boolean = false;
  chart: Chart | null = null;

  constructor(private reportsService: ReportsService) { }

  ngOnInit(): void {
  }

  generateReport() {
    if (this.selectedReportType) {
      this.isLoading = true;
      this.reportsService.generateReport(this.selectedReportType).subscribe(
        (data) => {
          this.reportData = data;
          this.isLoading = false;
          this.createChart();
        },
        (error) => {
          console.error('Error generating report:', error);
          this.isLoading = false;
        }
      );
    }
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(this.reportData),
        datasets: [{
          label: this.selectedReportType,
          data: Object.values(this.reportData),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}