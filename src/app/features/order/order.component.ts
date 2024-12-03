import { Component, OnInit } from '@angular/core';
import { Task } from '../../core/models/Task';
import { OrderService } from '../../services/order.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PrintOrder } from '../../core/models/PrintOrder';

@Component({
  selector: 'app-order',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  orders: PrintOrder[] = [];
  showAddTaskForm: boolean = false;
  newTaskTitle: string = '';
  isEditing: boolean = false;
  idToEdit: number = -1;

  renameForm: FormGroup;

  constructor(private orderService: OrderService, private fb: FormBuilder) {
    this.renameForm = this.fb.group({
      renamedTitle: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.fetchTasks();
  }

  toggleAddTaskForm() {
    this.showAddTaskForm = !this.showAddTaskForm;
  }

  fetchTasks() {
    this.orderService.getOrders().subscribe({
      next: (orders: PrintOrder[]) => {
        this.orders = orders;
        console.log(orders);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  async addTask(title: string) {
    if (this.newTaskTitle === '') return;

    await this.orderService.addOrder(title);
    this.newTaskTitle = '';

    this.fetchTasks();
  }

  async deleteTask(id: number) {
    await this.orderService.deleteOrder(id);

    this.fetchTasks();
  }

  startEditing(id: number) {
    this.isEditing = true;
    this.idToEdit = id;
  }

  cancelEditing() {
    this.isEditing = false;
    this.idToEdit = -1;
  }
}
