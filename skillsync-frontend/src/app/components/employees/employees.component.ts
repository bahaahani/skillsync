import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { NotificationService } from '../../services/notification.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmationDialogComponent],
  providers: [EmployeeService]
})
export class EmployeesComponent implements OnInit {
  employees: any[] = [];
  searchTerm: string = '';
  employeeForm: FormGroup;
  isEditing: boolean = false;
  editingEmployeeId: string | null = null;
  showConfirmDialog = false;
  confirmDialogMessage = '';
  employeeToDelete: any = null;

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      department: ['', Validators.required],
      jobRole: ['', Validators.required],
      skills: ['', Validators.required],
      team: [''],
      developmentPlan: ['']
    });
  }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe(
      (employees) => {
        this.employees = employees;
      },
      (error) => console.error('Error loading employees', error)
    );
  }

  searchEmployees() {
    if (this.searchTerm.trim() === '') {
      this.loadEmployees();
    } else {
      this.employees = this.employees.filter(employee =>
        employee.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.jobRole.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  openAddEmployeeModal() {
    this.isEditing = false;
    this.editingEmployeeId = null;
    this.employeeForm.reset();
  }

  openEditEmployeeModal(employee: any) {
    this.isEditing = true;
    this.editingEmployeeId = employee.id;
    this.employeeForm.patchValue({
      name: employee.name,
      department: employee.department,
      jobRole: employee.jobRole,
      skills: employee.skills.join(', '),
      team: employee.team,
      developmentPlan: employee.developmentPlan
    });
  }

  submitEmployeeForm() {
    if (this.employeeForm.valid) {
      const employeeData = {
        ...this.employeeForm.value,
        skills: this.employeeForm.value.skills.split(',').map((skill: string) => skill.trim())
      };

      if (this.isEditing) {
        this.employeeService.updateEmployee(this.editingEmployeeId!, employeeData).subscribe(
          (updatedEmployee) => {
            const index = this.employees.findIndex(e => e.id === updatedEmployee.id);
            if (index !== -1) {
              this.employees[index] = updatedEmployee;
            }
            this.employeeForm.reset();
            this.isEditing = false;
            this.editingEmployeeId = null;
          },
          (error) => console.error('Error updating employee', error)
        );
      } else {
        this.employeeService.addEmployee(employeeData).subscribe(
          (newEmployee) => {
            this.employees.push(newEmployee);
            this.employeeForm.reset();
          },
          (error) => console.error('Error adding employee', error)
        );
      }
    }
  }

  openDeleteConfirmation(employee: any) {
    this.employeeToDelete = employee;
    this.confirmDialogMessage = `Are you sure you want to delete ${employee.name}?`;
    this.showConfirmDialog = true;
  }

  confirmDelete() {
    if (this.employeeToDelete) {
      this.deleteEmployee(this.employeeToDelete);
    }
    this.showConfirmDialog = false;
  }

  cancelDelete() {
    this.employeeToDelete = null;
    this.showConfirmDialog = false;
  }

  deleteEmployee(employee: any) {
    this.employeeService.deleteEmployee(employee.id).subscribe(
      () => {
        this.employees = this.employees.filter(e => e.id !== employee.id);
        this.notificationService.showSuccess(`Employee ${employee.name} has been deleted.`);
      },
      (error: any) => this.errorHandlerService.handleError(error)
    );
  }
}