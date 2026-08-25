import { z } from 'zod';

/**
 * Days of the week a recurring quiz can run on.
 */
export const quizDaySchema = z.enum([
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]);

/**
 * How often a recurring quiz repeats.
 */
export const quizCadenceSchema = z.enum(['weekly', 'fortnightly', 'monthly', 'seasonal']);

/**
 * Broad Wellington region a quiz venue sits in.
 */
export const quizAreaSchema = z.enum([
  'Wellington City',
  'Lower Hutt',
  'Upper Hutt',
  'Porirua',
  'Kapiti Coast',
]);

/** Where a quiz listing was found, so readers can verify it themselves. */
export const quizSourceSchema = z.object({
  label: z.string().min(1),
  url: z.url(),
});

/**
 * One recurring pub quiz around Wellington.
 *
 * Validated at the data boundary so a bad entry fails the build instead of
 * breaking the calendar at runtime.
 */
export const quizSchema = z.object({
  /** Stable kebab-case slug, unique per quiz. */
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  /** Venue name as shown on the calendar. */
  venue: z.string().min(1),
  /** Suburb or town the venue is in. */
  suburb: z.string().min(1),
  /** Street address, used for the map link. */
  address: z.string().min(1),
  /** Broad region, used for filtering. */
  area: quizAreaSchema,
  /** Weekday the quiz runs on. */
  dayOfWeek: quizDaySchema,
  /** 24-hour start time, e.g. "19:00". */
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  /** Repeat pattern. */
  cadence: quizCadenceSchema,
  /** Human note for non-weekly cadences, e.g. "Fourth Thursday of the month". */
  cadenceNote: z.string().optional(),
  /** Entry cost, if known. */
  cost: z.string().optional(),
  /** What winners get, if known. */
  prizes: z.string().optional(),
  /** Quiz format, e.g. "5 rounds, 50 questions, team quiz". */
  format: z.string().optional(),
  /** How to get a spot, e.g. "Book a table". */
  booking: z.string().optional(),
  /** Anything worth knowing before turning up. */
  notes: z.string().optional(),
  /** Who runs the quiz, e.g. "Believe it or Not". */
  operator: z.string().optional(),
  /** Where this listing came from, so readers can double-check it. */
  source: quizSourceSchema,
  /** ISO date the listing was last checked. */
  lastVerified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

/** A validated quiz record. */
export type Quiz = z.infer<typeof quizSchema>;

/** Validates the full quiz dataset in one pass. */
export const quizListSchema = z.array(quizSchema);
