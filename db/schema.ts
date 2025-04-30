import { pgTable, serial, text, varchar, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 50 }),
  website: varchar('website', { length: 255 }),
  street: varchar('street', { length: 255 }),
  suite: varchar('suite', { length: 255 }),
  city: varchar('city', { length: 255 }),
  zipcode: varchar('zipcode', { length: 20 }),
  lat: varchar('lat', { length: 50 }),
  lng: varchar('lng', { length: 50 }),
  companyName: varchar('company_name', { length: 255 }),
  companyCatchPhrase: varchar('company_catch_phrase', { length: 255 }),
  companyBs: varchar('company_bs', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Posts table
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  body: text('body').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Comments table
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  body: text('body').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Albums table
export const albums = pgTable('albums', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Photos table
export const photos = pgTable('photos', {
  id: serial('id').primaryKey(),
  albumId: integer('album_id').notNull().references(() => albums.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  url: varchar('url', { length: 255 }).notNull(),
  thumbnailUrl: varchar('thumbnail_url', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Todos table
export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  albums: many(albums),
  todos: many(todos),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));

export const albumsRelations = relations(albums, ({ one, many }) => ({
  user: one(users, {
    fields: [albums.userId],
    references: [users.id],
  }),
  photos: many(photos),
}));

export const photosRelations = relations(photos, ({ one }) => ({
  album: one(albums, {
    fields: [photos.albumId],
    references: [albums.id],
  }),
}));

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
}));
