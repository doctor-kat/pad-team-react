import { Awakening } from './Awakening';
import { Monster } from './Monster';

declare global {
    interface Array<T> {
        filterByAwakening(currentAwakeningOptions: Awakening[]): Array<Monster>;
        filterByName(searchString: string): Array<Monster>;
        filterByPrimaryAttribute(attribute: number): Array<Monster>;
        filterBySubAttribute(attribute: number): Array<Monster>;
        sortByStat(stat: string): Array<Monster>;
    }
}

Array.prototype.filterByAwakening = 
    function(currentAwakeningOptions: Awakening[]): Monster[] {
        let compareAwakenings = (outer: number[], inner: number[]): boolean =>  {
            // map array of awakening ids to hash, then compare id counts
            let outerHash = {};
            let innerHash = {};
            
            for (let id of inner) { innerHash[id] = (innerHash[id] || 0) + 1; }
            for (let id of outer) { outerHash[id] = (outerHash[id] || 0) + 1; }
                
            for (let id of inner) {
                if ((outerHash[id] !== undefined) && (outerHash[id] >= innerHash[id])) {
                    //   console.debug(`Awakening id: ${id} OK.`);
                } else {
                    //   console.debug(`Awakening id: ${id} not OK.`);
                    return false;
                }
            }
            return true;
        }; // compareAwakenings

        if (this) {
            const awakeningOptionsIds = currentAwakeningOptions.map(awakening => awakening.id);

            let results = this.filter(
                (monster: Monster) => {
                    return compareAwakenings(monster.awoken_skills, awakeningOptionsIds);
                }
            );
            return results;
        } else {
            console.debug(`monsterList is empty.  No point in sorting.`);
            return this;
        }
    }; // filterByAwakening

Array.prototype.filterByName = 
    function(searchString: string) {
        return this.filter(
            monster => {
            // if monster.name contains searchString, .search will
            // return location of first match, else return -1
            return (monster.name.search(new RegExp(searchString, 'i')) > 0);
            }
        );
    }; // filterByName

Array.prototype.filterByPrimaryAttribute = 
    function(attribute: number) {
        return this.filter(
        monster => {
            return (monster.element === attribute);
        }
        );
    }; // filterByPrimaryAttribute

Array.prototype.filterBySubAttribute = 
    function(attribute: number) {
        return this.filter(
            monster => {
                return (monster.element2 === attribute);
            }
        );
    }; // filterBySubAttribute

Array.prototype.sortByStat = 
    function(stat: string) {
        /*
        *  returns comparison function
        *   for sortByStat
        */
        let propCompare = (prop: string) => {
            return (a: Monster, b: Monster): number => {
                if (a[prop] < b[prop]) { return 1; }
                if (a[prop] > b[prop]) { return -1; }
                return 0;
            };
        };

        let sorts = {
            idSort: propCompare('id'),
            hpSort: propCompare('hp_max'),
            atkSort: propCompare('atk_max'),
            rcvSort: propCompare('rcv_max'),
            totalSort: (a: Monster, b: Monster): number => {
                let getTotal = (mon: Monster) => {
                return (mon.hp_max / 10 + mon.atk_max / 5 + mon.rcv_max / 3);
                }; // getTotal

                if (getTotal(a) < getTotal(b)) { return 1; }
                if (getTotal(a) > getTotal(b))  {return -1; }
                return 0;
            } // totalSort
        };

        if (sorts[stat + 'Sort'] === undefined) {
            console.error(`${stat}Sort does not exist!  Returning unsorted monsterList.`);
            return this;
        } else {
            return this.sort(sorts[stat + 'Sort']);
        }
    }; // sortByStat