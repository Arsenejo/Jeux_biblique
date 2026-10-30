import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const files = [
  path.resolve(here, "../src/data/bibleData.js"),
  path.resolve(here, "../src/data/extendedStages.js")
];

const additions = [
  ["« Que les étoiles brillent ! »", "« Que l'homme paraisse ! »"],
  ["Yahvé Jiré (L'Éternel pourvoira)", "Yahvé Rapha (L'Éternel qui guérit)"],
  ["« Le Dieu du tonnerre et des éclairs »", "« Le Créateur du ciel seulement »"],
  ["Au nom de sa propre adresse et de sa fronde", "Au nom de son père Isaï"],
  ["Une bannière brodée d'or", "Un linge de lin blanc"],
  ["Les armes des quatre cent cinquante faux prophètes", "Uniquement l'eau versée dans le fossé"],
  ["À une forteresse de pierres", "À une épée à deux tranchants"],
  ["Nous ferons appel aux soldats pour nous défendre", "Nous demanderons un délai de trois jours"],
  ["Détruire toutes les bibliothèques perses", "Couronner un roi perse à Babylone"],
  ["« Le riche dominera par son or »", "« Le sage prospérera par sa prudence »"],
  ["Pour éprouver la force des hommes", "Pour établir un royaume politique immédiat"],
  ["Noé et Daniel", "Samuel et Isaïe"],
  ["« Attendez le soir pour voir paraître la lumière »", "« Qui a roulé la pierre pendant la nuit ? »"],
  ["Condamnés à lutter seuls", "Protégés seulement si nous ne péchons plus"],
  ["« À la sagesse éternelle des philosophes »", "« Aux douze dieux de la cité »"],
  ["Apollos", "Jacques, frère du Seigneur"],
  ["« Il faudra attendre mille générations »", "« Le livre est désormais scellé pour toujours »"],
  ["Aux deux lions rugissants du désert", "Aux deux aigles qui volent au milieu du ciel"],
  ["Parce qu'une armée ennemie les a attaqués", "Parce qu'ils avaient oublié le nom de Noé"],
  ["Un troupeau de cent brebis", "Un arc de chasse en bois d'acacia"],
  ["La femme de Potiphar", "La sœur aînée d'Aaron, seule"],
  ["Une lampe à huile allumée", "Un voile de pourpre royale"],
  ["Ils se promirent le trône en partage égal", "Ils s'unirent pour chasser les Philistins chaque sabbat"],
  ["Des brebis conduites par des bergers secrets", "Des cailles tombées autour du camp"],
  ["Elle impose le silence", "Elle affermit la sagesse"],
  ["L'amour de l'or et de l'argent", "La carte des nations"],
  ["De la mer occidentale", "Du septentrion (du nord)"],
  ["Il sera exempt de tout labeur terrestre", "Il héritera des troupeaux de son père"],
  ["Dix miches de blé et du miel sauvage", "Douze corbeilles déjà remplies"],
  ["Un olivier", "Un térébinthe"],
  ["Le prophète Daniel", "Le prophète Joël"],
  ["L'arc de la vérité prophétique", "Le bouclier de la foi, brandi comme une lance"],
  ["Nos richesses accumulées", "Nos sacrifices quotidiens"],
  ["À embaumer l'arche céleste", "À nourrir les oiseaux du paradis"]
];

for (const file of files) {
  let source = fs.readFileSync(file, "utf8");
  for (const [third, fourth] of additions) {
    if (source.includes(fourth)) continue;
    const needle = `{ text: "${third}", correct: false }`;
    const count = source.split(needle).length - 1;
    if (count !== 1) {
      console.log(`IGNORÉ (${count}) ${file} :: ${third}`);
      continue;
    }
    const idx = source.indexOf(needle);
    const lineEnd = source.indexOf("\n", idx);
    const lineStart = source.lastIndexOf("\n", idx) + 1;
    const indent = source.slice(lineStart, idx);
    const insertion = `,\n${indent}{ text: ${JSON.stringify(fourth)}, correct: false }`;
    source = source.slice(0, lineEnd) + insertion + source.slice(lineEnd);
    console.log(`ajouté: ${fourth}`);
  }
  fs.writeFileSync(file, source);
}
