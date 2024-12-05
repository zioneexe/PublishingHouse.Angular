import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss'],
  imports: [CommonModule, MatIconModule, MatButtonModule],
})
export class BookDetailsComponent implements OnInit {
  bookId: number | null = null;
  bookDetails: any;
  loading: boolean = true; 
  placeholderImage: string = 'assets/sample_book.jpg'; 

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.bookId = Number(params.get('id'));
      if (this.bookId) {
        this.getBookDetails();
      }
    });
  }

  getBookDetails(): void {
    this.loading = true; 
    this.bookService.getBookById(this.bookId!).subscribe({
      next: (data) => {
        console.log(data);
        this.bookDetails = {
          ...data,
          coverImagePath: data.coverImagePath
            ? `${environment.baseApiUrl}${data.coverImagePath}`
            : this.placeholderImage
        };
        this.loading = false; 
      },
      error: (err) => {
        console.error('Error fetching book details:', err);
        this.loading = false; 
      },
    });
  }

  goBack(): void {
    this.location.back(); 
  }
}
