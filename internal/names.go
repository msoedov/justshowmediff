package internal

import (
	"fmt"
	"math/rand"
)

var adjectives = []string{
	"bold", "calm", "cool", "dark", "dry", "fast", "flat", "free",
	"gold", "gray", "hazy", "icy", "keen", "kind", "late", "lean",
	"long", "loud", "mild", "neat", "odd", "pale", "pure", "rare",
	"red", "rich", "shy", "slim", "soft", "tall", "tiny", "warm",
	"wild", "wise", "young", "blue", "crisp", "dawn", "dusk", "fern",
	"glad", "green", "jade", "lush", "mint", "moon", "pink", "plum",
	"rust", "sage", "snow", "sun", "teal", "vast", "zen", "amber",
	"coral", "ivory", "maple", "misty", "olive", "rapid", "silent",
	"stark", "swift", "vivid", "quiet", "bright", "gentle", "hidden",
}

var nouns = []string{
	"arc", "bay", "brook", "cave", "cliff", "cloud", "cove", "creek",
	"dew", "drift", "dune", "dust", "elm", "ember", "fall", "fern",
	"field", "flame", "fog", "frost", "gale", "gate", "glen", "grove",
	"haze", "hill", "isle", "lake", "leaf", "marsh", "mist", "moss",
	"oak", "path", "peak", "pine", "pond", "pool", "rain", "reef",
	"ridge", "river", "rock", "rose", "sage", "shade", "shore", "sky",
	"snow", "star", "stone", "storm", "sun", "surf", "tide", "trail",
	"vale", "wave", "well", "wind", "wood", "bloom", "branch", "canyon",
	"delta", "fjord", "forge", "haven", "meadow", "prairie", "summit",
}

func HerokuName() string {
	a := adjectives[rand.Intn(len(adjectives))]
	n := nouns[rand.Intn(len(nouns))]
	return fmt.Sprintf("%s-%s-%d", a, n, rand.Intn(9000)+1000)
}
