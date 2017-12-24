package helper

import (
	"hash/fnv"

	"github.com/pkg/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

const zoneKey = "failure-domain.beta.kubernetes.io/zone"

// Get the zone this Slug should be installed in.
// Try to maintain the affinity.
// Also try to balance the load evenly between the available zones.
func GetZone(slug string, c *kubernetes.Clientset) (string, error) {
	l, err := c.CoreV1().Nodes().List(metav1.ListOptions{})
	if err != nil {
		return "", errors.Wrap(err, "Cannot fetch nodes")
	}

	var zones []string
	for _, x := range l.Items {
		labels := x.GetLabels()
		zone, ok := labels[zoneKey]
		if ok {
			zones = append(zones, zone)
		}
	}

	h := fnv.New32a()
	h.Write([]byte(slug))
	index := h.Sum32() % uint32(len(zones))
	return zones[index], nil
}
