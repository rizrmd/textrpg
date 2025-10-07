import type { PlayerSession } from '../types/player';
import { playerAttack, playerHeal, executeEnemyAbility, addToBattleLog, getNextEnemy, selectLocation, generateEnemyImageUrl, generateLoot } from './gameEngine';
import { LootManager } from './lootManager';

export class BattleManager {
  static startEnemyAttacks(session: PlayerSession): void {
    const { battleState } = session;

    // If enemy is already dead, handle the defeated state
    if (battleState.enemy.hp <= 0 && !battleState.lootPhase && !battleState.waitingForNext && !battleState.locationSelectionPhase) {
      // Enemy was defeated but state wasn't properly updated - fix it
      addToBattleLog(battleState, `${battleState.enemy.name} has been defeated!`);

      // Award experience
      const expGained = battleState.enemy.experienceValue;
      battleState.player.experience += expGained;
      addToBattleLog(battleState, `Gained ${expGained} experience!`);

      // Check for level up
      const expNeeded = battleState.player.level * 100;
      if (battleState.player.experience >= expNeeded) {
        battleState.player.level += 1;
        battleState.player.experience -= expNeeded;

        // Level up bonuses
        battleState.player.maxHp += 10;
        battleState.player.hp = battleState.player.maxHp;
        battleState.player.attack += 2;
        battleState.player.defense += 1;

        addToBattleLog(battleState, `LEVEL UP! Now level ${battleState.player.level}!`);
        addToBattleLog(battleState, `HP +10, Attack +2, Defense +1`);
      }

      battleState.lootPhase = true;
      battleState.availableLoot = generateLoot(battleState);
      addToBattleLog(battleState, `${battleState.enemy.name} dropped items!`);

      console.log('Fixed defeated enemy state for player:', session.playerId);
      return;
    }

    if (session.enemyAttackInterval) {
      clearInterval(session.enemyAttackInterval);
    }

    session.enemyAttackInterval = setInterval(() => {
      this.processEnemyTurn(session);
    }, 2000);

    console.log('Enemy attack started for player:', session.playerId);
  }

  static stopEnemyAttacks(session: PlayerSession): void {
    if (session.enemyAttackInterval) {
      clearInterval(session.enemyAttackInterval);
      session.enemyAttackInterval = null;
    }
  }

  private static processEnemyTurn(session: PlayerSession): void {
    const { battleState } = session;

    if (battleState.enemy.hp <= 0) {
      this.stopEnemyAttacks(session);
      return;
    }

    if (battleState.player.hp <= 0 || battleState.lootPhase || battleState.waitingForNext) {
      this.stopEnemyAttacks(session);
      return;
    }

    // Regular attack
    const damage = Math.max(1, battleState.enemy.attack - battleState.player.defense + Math.floor(Math.random() * 5));
    battleState.player.hp = Math.max(0, battleState.player.hp - damage);
    addToBattleLog(battleState, `${battleState.enemy.name} deals ${damage} damage to ${battleState.player.name}!`);

    // Check and execute abilities
    battleState.enemy.abilities.forEach(ability => {
      if (ability.currentCooldown > 0) {
        ability.currentCooldown--;
      }

      if (ability.currentCooldown === 0 && Math.random() < 0.3) {
        executeEnemyAbility(battleState, ability);
        ability.currentCooldown = ability.cooldown;
      }
    });

    if (battleState.player.hp <= 0) {
      addToBattleLog(battleState, `${battleState.player.name} has been defeated!`);
      battleState.lootPhase = true;
      battleState.availableLoot = [{ name: 'Restart', rarity: '' }];
      addToBattleLog(battleState, 'Game Over! Choose to restart.');
      this.stopEnemyAttacks(session);
    }
  }

  static handlePlayerAction(session: PlayerSession, action: string, item?: any, locationIndex?: number): void {
    switch (action) {
      case 'attack':
        playerAttack(session.battleState);
        break;
      case 'heal':
        playerHeal(session.battleState);
        break;
      case 'reset':
        this.resetBattle(session);
        break;
      case 'pickLoot':
        this.handleLootPick(session, item);
        break;
      case 'selectLocation':
        if (locationIndex !== undefined) {
          this.handleLocationSelection(session, locationIndex);
        }
        break;
    }
  }

  private static handleLootPick(session: PlayerSession, item: any): void {
    const { battleState } = session;

    if (typeof item === 'string') {
      if (item === 'Restart') {
        this.resetBattle(session);
        return;
      }
      if (item === 'Skip') {
        addToBattleLog(battleState, 'You skipped the loot!');
        battleState.lootPhase = false;
        this.advanceToNextEnemy(session);
        return;
      }
    } else {
      // Handle loot item
      const loot = item;
      const index = battleState.availableLoot.findIndex(l => l.name === loot.name && l.rarity === loot.rarity);
      if (index > -1) {
        battleState.availableLoot.splice(index, 1);
        addToBattleLog(battleState, `You picked up ${loot.rarity} ${loot.name}!`);
        LootManager.applyItemEffects(battleState, loot);
        battleState.lootPhase = false;
        this.advanceToNextEnemy(session);
      }
    }
  }

  private static handleLocationSelection(session: PlayerSession, locationIndex: number): void {
    const { battleState } = session;
    battleState.loadingEnemyImage = true;
    selectLocation(battleState, locationIndex);
    battleState.loadingEnemyImage = false;
    this.startEnemyAttacks(session);
  }

  private static advanceToNextEnemy(session: PlayerSession): void {
    const { battleState } = session;

    battleState.waitingForNext = true;
    battleState.countdown = 1;
    addToBattleLog(battleState, 'Continuing adventure!');

    const currentLocation = battleState.locations[battleState.player.currentLocationIndex];
    if (currentLocation) {
      const originalLocationIndex = battleState.player.currentLocationIndex;
      currentLocation.defeated++;

      const enemiesRemaining = currentLocation.enemies.length - currentLocation.defeated;

      if (enemiesRemaining > 0) {
        addToBattleLog(battleState, `${enemiesRemaining} enemies remaining in ${currentLocation.name}`);
      } else {
        addToBattleLog(battleState, `${currentLocation.name} cleared!`);
        battleState.locationSelectionPhase = true;
        addToBattleLog(battleState, 'Choose your next location!');
        return;
      }

      setTimeout(() => {
        battleState.waitingForNext = false;
        const nextEnemy = getNextEnemy(battleState);
        if (nextEnemy) {
          battleState.loadingEnemyImage = true;
          battleState.enemy = { ...nextEnemy };
          battleState.enemyImageUrl = generateEnemyImageUrl(
            nextEnemy.name,
            battleState.locations[battleState.player.currentLocationIndex]?.name || 'Unknown',
            nextEnemy.abilities
          );
           battleState.loadingEnemyImage = false;
           if (battleState.player.currentLocationIndex !== originalLocationIndex) {
            addToBattleLog(battleState, `Entered ${battleState.locations[battleState.player.currentLocationIndex]?.name || 'Unknown'}!`);
          }
          addToBattleLog(battleState, `A wild ${nextEnemy.name} appears!`);
          this.startEnemyAttacks(session);
        } else {
          addToBattleLog(battleState, 'All locations completed! You are victorious!');
        }

        // Send updated state to client after enemy transition
        if (session.ws) {
          session.ws.send(JSON.stringify({ type: 'state', data: battleState }));
        }
      }, 1000);
    }
  }

  private static resetBattle(session: PlayerSession): void {
    this.stopEnemyAttacks(session);
    // Reset logic would go here
    setTimeout(() => {
      this.startEnemyAttacks(session);
    }, 100);
  }
}