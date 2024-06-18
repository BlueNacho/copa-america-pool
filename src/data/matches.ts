// fetchMatchesWithPredictions.ts
'use server';

import { MatchDisplayed } from "../types/types";
import { pool } from "./postgrePool";
import { unstable_noStore as noStore } from 'next/cache';

export async function getMatchesDisplayed(userId: string): Promise<MatchDisplayed[]> {
    noStore()
    const client = await pool.connect();

    try {
        const query = `
            SELECT 
                m.id,
                m.home_team_id,
                ht.name AS home_team_name,
                ht.code AS home_team_code,
                m.away_team_id,
                at.name AS away_team_name,
                at.code AS away_team_code,
                m.home_team_goals,
                m.away_team_goals,
                m.start_time,
                m.phase,
                m.group_name,
                m.status,
                p.home_team_goals AS prediction_home_team_goals,
                p.away_team_goals AS prediction_away_team_goals
            FROM matches m
            JOIN teams ht ON m.home_team_id = ht.id
            JOIN teams at ON m.away_team_id = at.id
            LEFT JOIN predictions p ON m.id = p.match_id AND p.user_id = $1
        `;
        const res = await client.query(query, [userId]);
        return res.rows as MatchDisplayed[];
    } catch (error) {
        console.error("Error fetching matches with predictions:", error);
        throw error;
    } finally {
        client.release();
    }
}

export async function getAdminMatchById(matchId: string): Promise<MatchDisplayed> {
    const client = await pool.connect();

    try {
        const query = `
            SELECT 
                m.id,
                m.home_team_id,
                ht.name AS home_team_name,
                ht.code AS home_team_code,
                m.away_team_id,
                at.name AS away_team_name,
                at.code AS away_team_code,
                m.home_team_goals,
                m.away_team_goals,
                m.start_time,
                m.phase,
                m.group_name,
                m.status
            FROM matches m
            JOIN teams ht ON m.home_team_id = ht.id
            JOIN teams at ON m.away_team_id = at.id
            WHERE m.id = $1
        `;
        const res = await client.query(query, [matchId]);
        return res.rows[0] as MatchDisplayed;
    } catch (error) {
        console.error("Error fetching match:", error);
        throw error;
    } finally {
        client.release();
    }
}