import "mocha";
import { assert } from "chai";
import { KanjiList } from "../src/KanjiList";
import { MatchAlgorithm } from "../src/MatchAlgorithm";
import { KanjiVgLoaderTest } from "./KanjiVgLoader.test";

describe("FuzzyComparer.test", () => {

    const DEBUG = false;

    it("testBigMatch", async () => {
        // This compares the first 5 20-stroke kanji characters against all the
        // others and checks that they match themselves. In addition to correctness
        // checking it can be used for timing comparison (increasing the limit may
        // give more stable results).
        const list = new KanjiList();
        const readAll = await KanjiVgLoaderTest.getAll();
        for (const kanjiInfo of readAll) {
            list.add(kanjiInfo);
        }

        const all20 = list.getKanji(20);

        for (let i = 0; i < all20.length && i < (DEBUG ? 100 : 5); i++) {
            const big = all20[i];
            if (DEBUG) {
                console.log(big.kanji);
                if (i % 10 === 9) {
                    console.log();
                }
            }
            const matches = await
                list.getTopMatches(big, MatchAlgorithm.FUZZY);
            assert.equal(big.kanji, matches[0].kanjiInfo.kanji);
        }

    });

});
