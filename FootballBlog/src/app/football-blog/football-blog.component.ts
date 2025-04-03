import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';


interface BlogPost {
  id: number;
  title: string;
  author: string;
  description: string;
  creationDate: string;
  expanded: boolean;
}

@Component({
  selector: 'app-football-blog',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './football-blog.component.html',
  styleUrl: './football-blog.component.css'
})


export class FootballBlogComponent {
  private router = inject (Router);

  blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Matchday Recap: Liverpool vs. Manchester United',
      author: 'John Doe',
      description: 'A thrilling match between two football giants ended in a dramatic draw.',
      creationDate: '2024-04-02',
      expanded: false
    },
    {
      id: 2,
      title: 'Top 10 Goals of the Season',
      author: 'Jane Smith',
      description: 'We count down the best goals from this football season.',
      creationDate: '2024-03-30',
      expanded: false
    },
    {
      id: 3,
      title: 'How VAR Changed the Game',
      author: 'Alex Johnson',
      description: 'A deep dive into how Video Assistant Referee (VAR) has impacted football.',
      creationDate: '2024-03-28',
      expanded: false
    }
  ];

  toggleReadMore(post: any) {
    post.expanded = !post.expanded;
  }


  ngOnInit(): void {
    console.log("FootballBlogComponent initialized");

  }
  goToPost(postId: number) {
    this.router.navigate(['/post', postId]);
  }

}
