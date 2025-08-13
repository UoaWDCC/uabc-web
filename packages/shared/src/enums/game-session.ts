export enum GameSessionTimeframe {
  /**
   * Any game sessions that are upcoming (excludes past game sessions)
   */
  UPCOMING = "upcoming",
  /**
   * Any game sessions that are past (excludes upcoming game sessions)
   */
  PAST = "past",
  /**
   * Any game sessions that are current (excludes past game sessions, or sessions that aren't open yet)
   */
  CURRENT = "current",
  /**
   * All of the game sessions
   */
  DEFAULT = "default",
}
