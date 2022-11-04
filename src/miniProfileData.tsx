export interface miniProfileModel {
  id: number;
  username: string;
  name: string;
  rating: string;
  country: string;
  bio: string;
  tags: [string];
  posts: number;
  followers: string;
  following: string;
}

export default [
  {
    id: 468,
    username: 'AnnetteBlack',
    name: 'Annette Black',
    rating: '4.5',
    country: 'canada',
    bio: 'Focus on web development. Category. Loving, caring, Goal-oriented',
    tags: ['Web Development', 'Piano', 'English', 'Cycling'],
    posts: 200,
    followers: '10.6K',
    following: '6.2K',
  },
];
